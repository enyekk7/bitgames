# 🎮 Bitgame

Web3 gaming platform on Stacks blockchain with on-chain tipping using BIT tokens.

## 🏗️ Architecture

- **Frontend**: Vite + React + TypeScript
- **Backend**: Express + MongoDB Atlas
- **Blockchain**: Stacks (Clarity smart contracts)
- **Wallet**: Leather/Xverse integration via @stacks/connect
- **Monorepo**: pnpm workspaces

## 📁 Structure

```
bitgame/
├─ apps/
│  ├─ web/                 # Frontend (Vite + React)
│  ├─ api/                 # Backend (Express + MongoDB)
│  └─ contracts/           # Clarity smart contracts
├─ games-external/         # External HTML games
└─ tools/                  # Build tools & sync scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB Atlas account
- Clarinet (for smart contracts)

### Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and contract addresses
   ```

3. **Deploy contracts (Clarinet)**
   ```bash
   cd apps/contracts
   clarinet integrate
   ```

4. **Sync external games**
   ```bash
   pnpm sync:games
   ```

5. **Seed database**
   ```bash
   pnpm seed
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Backend
   pnpm dev:api

   # Terminal 2: Frontend
   pnpm dev:web
   ```

7. **Open browser**
   ```
   http://localhost:5173
   ```

## 🎮 Features

- **Wallet Integration**: Connect with Leather or Xverse
- **Multiple Games**: Play Snake, Math Quiz, and more
- **Social Feed**: Share scores Twitter-style
- **On-chain Tipping**: Send BIT tokens to players
- **Leaderboards**: Compete for high scores
- **Profile**: View your stats and wallet balance

## 🔧 Development

### Available Scripts

- `pnpm dev:web` - Start frontend dev server
- `pnpm dev:api` - Start backend dev server
- `pnpm sync:games` - Sync external games to public folder
- `pnpm seed` - Seed database with initial data
- `pnpm test:contracts` - Run Clarity contract tests
- `pnpm clarinet:devnet` - Start Clarinet devnet

### Adding New Games

#### React Game (Internal)
1. Create folder in `apps/web/src/games/{game-name}/`
2. Add `index.tsx` and `manifest.json`
3. Implement BitgameBridge SDK for score submission

#### HTML Game (External)
1. Create folder in `games-external/{game-name}/`
2. Add `index.html` and `manifest.json`
3. Run `pnpm sync:games` to copy to public folder

## 📜 Smart Contracts

### bit-token.clar
SIP-010 fungible token for tipping and rewards.

### game-registry.clar
On-chain game registry and score verification.

## 🌐 API Endpoints

- `GET /api/games` - List all games
- `GET /api/games/:slug` - Get game details
- `POST /api/games/:slug/score` - Submit score
- `GET /api/leaderboard/:slug` - Get leaderboard
- `GET /api/feed` - Get social feed
- `POST /api/feed/:id/like` - Like post
- `POST /api/feed/:id/repost` - Repost
- `POST /api/feed/:id/tip` - Record tip transaction

## 📄 License

MIT



