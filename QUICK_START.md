# ⚡ Quick Start Guide

Get Bitgame running locally in 5 minutes!

## Prerequisites

Install these tools first:
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) - `npm install -g pnpm`
- [Clarinet](https://github.com/hirosystems/clarinet) - For smart contracts

## 1. Clone & Install

```bash
cd bitgame
pnpm install
```

## 2. Setup MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Copy to `.env` files

**Option B: Local MongoDB**
```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Connection string:
mongodb://localhost:27017/bitgame
```

## 3. Configure Environment

```bash
# Root .env
cp .env.example .env

# Backend .env
cd apps/api
cp .env.example .env
# Edit MONGODB_URI with your connection string

# Frontend .env
cd ../web
cp .env.example .env
# Keep default values for local development
```

## 4. Sync & Seed

```bash
# From root directory
pnpm sync:games
pnpm seed
```

## 5. Start Development

Open 2 terminals:

**Terminal 1 - Backend:**
```bash
pnpm dev:api
```

**Terminal 2 - Frontend:**
```bash
pnpm dev:web
```

## 6. Open Browser

Visit: http://localhost:5173

## 7. Connect Wallet (Optional)

For testing on-chain features:

1. Install [Leather Wallet](https://leather.io/) or [Xverse](https://www.xverse.app/)
2. Switch to **Testnet** mode
3. Get testnet STX from [faucet](https://explorer.stacks.co/sandbox/faucet)
4. Click "Connect Wallet" in Bitgame

## What's Next?

- Play games: Click "Games" → Select a game → "Play Now"
- Share scores: After game over → "Share to Feed"
- View feed: See all shared scores on home page
- Tip players: Click 🎁 on posts (requires wallet)

## Troubleshooting

**Port already in use:**
```bash
# Change ports in .env files
API_PORT=3002  # in apps/api/.env
# Update VITE_API_URL in apps/web/.env
```

**MongoDB connection error:**
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Test connection: `mongosh "your-connection-string"`

**Wallet connection issues:**
- Clear browser cache
- Ensure wallet is on testnet
- Check browser console for errors

**Games not loading:**
```bash
pnpm sync:games  # Re-sync external games
```

## Project Structure

```
bitgame/
├─ apps/
│  ├─ web/          → Frontend (http://localhost:5173)
│  ├─ api/          → Backend (http://localhost:3001)
│  └─ contracts/    → Smart contracts
├─ games-external/  → HTML games (sync to public/)
└─ tools/           → Sync scripts
```

## Available Scripts

From root directory:

```bash
pnpm dev:web        # Start frontend dev server
pnpm dev:api        # Start backend dev server
pnpm dev            # Start both (parallel)
pnpm sync:games     # Sync external games
pnpm seed           # Seed database
pnpm build          # Build all apps
```

## Smart Contracts (Advanced)

```bash
cd apps/contracts

# Start local devnet
clarinet integrate

# Run tests
clarinet test

# Check contracts
clarinet check
```

## Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
3. Check browser console for errors
4. Review [README.md](./README.md) for features overview

Happy Gaming! 🎮




