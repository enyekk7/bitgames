;; BIT Token - SIP-010 Fungible Token for Bitgame Platform
;; Implements the SIP-010 fungible token trait

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define the BIT fungible token
(define-fungible-token BIT)

;; Storage
(define-data-var total-supply uint u0)
(define-data-var token-name (string-ascii 32) "Bitgame Token")
(define-data-var token-symbol (string-ascii 10) "BIT")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) none)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))

;; SIP-010 Required Functions

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? BIT amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok (var-get token-name))
)

(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance BIT who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply BIT))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Custom Functions

(define-public (set-token-uri (value (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set token-uri (some value))
    (ok true)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (try! (ft-mint? BIT amount recipient))
    (ok true)
  )
)

(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender owner) err-not-token-owner)
    (try! (ft-burn? BIT amount owner))
    (ok true)
  )
)

;; Initialize with some supply for testing
(begin
  (try! (ft-mint? BIT u1000000000000 contract-owner))
  (ok true)
)



