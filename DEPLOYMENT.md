# 🚀 Deployment Guide

## Prerequisites

- Node.js 18+
- pnpm
- MongoDB Atlas account
- Clarinet (for smart contracts)
- Leather or Xverse wallet with testnet STX

## Step-by-Step Deployment

### 1. Setup MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is fine for testing)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for testing)
5. Get your connection string

### 2. Deploy Smart Contracts

```bash
cd apps/contracts

# Start Clarinet devnet for local testing
clarinet integrate

# Or deploy to testnet
clarinet deploy --testnet

# Note the deployed contract addresses
```

Update `.env` files with the deployed contract addresses.

### 3. Configure Environment Variables

**Root `.env`:**
```bash
cp .env.example .env
# Edit with your MongoDB URI
```

**Backend `.env`:**
```bash
cd apps/api
cp .env.example .env
# Edit with:
# - MongoDB URI
# - Contract addresses from step 2
```

**Frontend `.env`:**
```bash
cd apps/web
cp .env.example .env
# Edit with:
# - API URL (http://localhost:3001/api for local)
# - Contract addresses from step 2
```

### 4. Install Dependencies

```bash
# From root directory
pnpm install
```

### 5. Sync External Games

```bash
pnpm sync:games
```

This copies HTML games from `games-external/` to `apps/web/public/games-host/`

### 6. Seed Database

```bash
pnpm seed
```

This populates MongoDB with initial game data.

### 7. Start Development Servers

**Terminal 1 - Backend:**
```bash
pnpm dev:api
```

**Terminal 2 - Frontend:**
```bash
pnpm dev:web
```

Frontend will be available at http://localhost:5173

### 8. Production Build

**Backend:**
```bash
cd apps/api
pnpm build
pnpm start
```

**Frontend:**
```bash
cd apps/web
pnpm build
pnpm preview
```

## Production Deployment Options

### Frontend (Vercel/Netlify)

1. Build: `cd apps/web && pnpm build`
2. Deploy `dist` folder
3. Set environment variables in hosting dashboard

### Backend (Railway/Render/Heroku)

1. Build: `cd apps/api && pnpm build`
2. Start command: `node dist/server.js`
3. Set environment variables in hosting dashboard

### Smart Contracts (Stacks Mainnet)

```bash
cd apps/contracts
clarinet deploy --mainnet
```

## Wallet Setup

### For Testing (Testnet)

1. Install Leather or Xverse wallet
2. Switch to Testnet mode
3. Get testnet STX from faucet: https://explorer.stacks.co/sandbox/faucet
4. Connect wallet on the Bitgame platform

### For Production (Mainnet)

1. Deploy contracts to mainnet
2. Update all `.env` files with mainnet contract addresses
3. Set `STACKS_NETWORK=mainnet`
4. Users connect with mainnet wallets

## Minting BIT Tokens

After deploying the `bit-token` contract, mint initial supply:

```bash
# Using Clarinet console
clarinet console

# Mint tokens (adjust amount as needed)
(contract-call? .bit-token mint u1000000000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

## Registering Games On-Chain

```bash
# Using Clarinet console
(contract-call? .game-registry register-game "https://bitgame.io/games/snake" "Snake Game")
(contract-call? .game-registry register-game "https://bitgame.io/games/math-quiz" "Math Quiz")
```

## Monitoring

- Backend logs: Check your hosting provider's logs
- MongoDB: Use MongoDB Atlas dashboard
- Stacks transactions: https://explorer.stacks.co

## Troubleshooting

### Wallet Connection Issues
- Ensure wallet is on correct network (testnet/mainnet)
- Check browser console for errors
- Verify contract addresses in `.env`

### Database Connection Issues
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Game Sync Issues
- Run `pnpm sync:games` after adding new games
- Check `games-external/*/manifest.json` format
- Verify files copied to `apps/web/public/games-host/`

## Security Notes

- Never commit `.env` files
- Use environment-specific contract addresses
- Implement rate limiting for production API
- Add authentication for admin operations
- Validate all user inputs
- Use HTTPS in production



