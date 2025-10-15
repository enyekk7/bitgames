;; Game Registry - On-chain game registration and score tracking

;; Storage
(define-data-var contract-owner principal tx-sender)
(define-data-var next-game-id uint u1)

;; Maps
(define-map games 
  { id: uint } 
  { 
    developer: principal, 
    uri: (string-ascii 200),
    name: (string-ascii 50),
    active: bool
  }
)

(define-map game-scores 
  { game-id: uint, player: principal } 
  { best-score: uint, total-plays: uint }
)

(define-map score-hashes 
  { hash: (buff 32) } 
  { used: bool }
)

;; Constants
(define-constant err-owner-only (err u100))
(define-constant err-duplicate-hash (err u101))
(define-constant err-game-not-found (err u102))
(define-constant err-unauthorized (err u103))

;; Private Functions

(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

;; Public Functions

(define-public (register-game (uri (string-ascii 200)) (name (string-ascii 50)))
  (let 
    (
      (game-id (var-get next-game-id))
    )
    (asserts! (is-contract-owner) err-owner-only)
    (map-set games 
      { id: game-id }
      { 
        developer: tx-sender, 
        uri: uri,
        name: name,
        active: true
      }
    )
    (var-set next-game-id (+ game-id u1))
    (ok game-id)
  )
)

(define-public (submit-score (game-id uint) (score uint) (payload-hash (buff 32)))
  (let
    (
      (game (unwrap! (map-get? games { id: game-id }) err-game-not-found))
      (current-score (default-to 
        { best-score: u0, total-plays: u0 } 
        (map-get? game-scores { game-id: game-id, player: tx-sender })
      ))
      (new-best (if (> score (get best-score current-score)) score (get best-score current-score)))
    )
    ;; Check if hash already used
    (asserts! (is-none (map-get? score-hashes { hash: payload-hash })) err-duplicate-hash)
    
    ;; Mark hash as used
    (map-set score-hashes { hash: payload-hash } { used: true })
    
    ;; Update score
    (map-set game-scores 
      { game-id: game-id, player: tx-sender }
      { 
        best-score: new-best, 
        total-plays: (+ (get total-plays current-score) u1)
      }
    )
    (ok new-best)
  )
)

(define-public (toggle-game-status (game-id uint))
  (let
    (
      (game (unwrap! (map-get? games { id: game-id }) err-game-not-found))
    )
    (asserts! (is-contract-owner) err-owner-only)
    (map-set games 
      { id: game-id }
      (merge game { active: (not (get active game)) })
    )
    (ok true)
  )
)

;; Read-only Functions

(define-read-only (get-game (game-id uint))
  (map-get? games { id: game-id })
)

(define-read-only (get-player-score (game-id uint) (player principal))
  (map-get? game-scores { game-id: game-id, player: player })
)

(define-read-only (get-next-game-id)
  (ok (var-get next-game-id))
)

(define-read-only (is-hash-used (payload-hash (buff 32)))
  (is-some (map-get? score-hashes { hash: payload-hash }))
)



