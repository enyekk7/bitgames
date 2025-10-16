# Bitgame Smart Contracts

Clarity smart contracts for the Bitgame platform on Stacks blockchain.

## Contracts

### bit-token.clar
SIP-010 compliant fungible token used for tipping and rewards.

**Functions:**
- `transfer` - Transfer tokens between accounts
- `mint` - Mint new tokens (owner only)
- `burn` - Burn tokens from your account
- `get-balance` - Get token balance of an account
- `get-total-supply` - Get total token supply

### game-registry.clar
On-chain game registry and score verification system.

**Functions:**
- `register-game` - Register a new game (owner only)
- `submit-score` - Submit a game score with anti-replay protection
- `toggle-game-status` - Enable/disable a game (owner only)
- `get-game` - Get game details
- `get-player-score` - Get player's best score for a game

## Development

### Prerequisites
- Clarinet installed (`curl -L https://github.com/hirosystems/clarinet/releases/download/v1.8.0/clarinet-linux-x64.tar.gz | tar xz`)

### Testing
```bash
clarinet test
```

### Deploy to Devnet
```bash
clarinet integrate
```

### Deploy to Testnet
```bash
clarinet deploy --testnet
```

## Usage

### Minting Tokens
```clarity
(contract-call? .bit-token mint u1000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

### Registering a Game
```clarity
(contract-call? .game-registry register-game "https://bitgame.io/games/snake" "Snake Game")
```

### Submitting a Score
```clarity
(contract-call? .game-registry submit-score u1 u1000 0x1234567890abcdef)
```





