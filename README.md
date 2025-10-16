# 🎮 Bitgame

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Stacks Blockchain](https://img.shields.io/badge/blockchain-Stacks-00D4FF)](https://stacks.co/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248)](https://www.mongodb.com/)

> A decentralized gaming platform built on Stacks blockchain featuring on-chain score verification, social sharing, and STX token tipping system.

## 🌟 Features

- 🎯 **Multi-Game Platform**: Play Snake, Math Quiz, Bitcoin Quiz, Stacks Quiz, Tic-Tac-Toe, and Penalty Shootout
- 🔗 **Web3 Integration**: Connect with Leather or Xverse wallets via Stacks Connect
- 🏆 **On-Chain Verification**: Score verification through Clarity smart contracts
- 💰 **STX Tip**: Earn and tip STX
- 📱 **Social Gaming Feed**: Share achievements and interact with the community
- 🏅 **Leaderboards**: Compete for top scores across all games
- 👤 **User Profiles**: Track your gaming statistics and wallet balance
- 🎨 **Customizable Sharing**: Beautiful score sharing templates

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB Atlas
- **Blockchain**: Stacks (Clarity smart contracts)
- **Wallet Integration**: @stacks/connect
- **Build System**: pnpm workspaces (monorepo)
- **Deployment**: Vercel

### Project Structure

```
bitgame/
├── apps/
│   ├── web/                    # Frontend React application
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── games/         # Game implementations (6 games currently)
│   │   │   ├── routes/        # Page components
│   │   │   ├── context/       # React context providers
│   │   │   └── lib/           # Utilities and API client
│   │   └── public/            # Static assets and game thumbnails
│   ├── api/                    # Backend Express server
│   │   ├── src/
│   │   │   ├── models/        # MongoDB schemas
│   │   │   ├── routes/        # API endpoints
│   │   │   └── config/        # Database and blockchain config
│   │   └── vercel.json        # Vercel deployment config
│   └── contracts/              # Clarity smart contracts
│       ├── contracts/          # Contract source code
│       └── tests/             # Contract tests
├── tools/                      # Build tools and utilities
└── vercel.json                # Root deployment config
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** package manager
- **MongoDB Atlas** account (free tier available)
- **Clarinet** (for smart contract development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bitgame.git
   cd bitgame
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Create environment files for each app:
   
   **Backend** (`apps/api/.env`):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bitgame
   NODE_ENV=development
   PORT=3001
   STACKS_NETWORK=testnet
   ```

   **Frontend** (`apps/web/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_STACKS_NETWORK=testnet
   VITE_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
   ```

4. **Deploy Smart Contracts** (Optional for development)
   ```bash
   cd apps/contracts
   clarinet integrate
   clarinet deploy
   ```

5. **Seed Database**
   ```bash
   pnpm seed
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1: Backend API
   pnpm dev:api
   
   # Terminal 2: Frontend
   pnpm dev:web
   ```

7. **Open Application**
   
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 Available Games

> **Current Games**: 6 games available with more coming soon!

| Game | Type | Description | Features |
|------|------|-------------|----------|
| 🐍 **Snake** | React | Classic snake game | Score tracking, leaderboards |
| 🧮 **Math Quiz** | React | Arithmetic challenges | Difficulty levels, timed rounds |
| ₿ **Bitcoin Quiz** | React | Bitcoin knowledge test | Educational content, achievements |
| 📚 **Stacks Quiz** | React | Stacks blockchain quiz | Web3 education, token rewards |
| ⭕ **Tic-Tac-Toe** | React | Strategic board game | AI opponent, win tracking |
| ⚽ **Penalty** | React | Football penalty shootout | Physics-based gameplay |

*More games are continuously being added to expand the platform!*

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev:web          # Start frontend dev server (port 5173)
pnpm dev:api          # Start backend dev server (port 3001)
pnpm dev              # Start both servers concurrently

# Building
pnpm build:web        # Build frontend for production
pnpm build:api        # Build backend for production
pnpm build            # Build all applications

# Database
pnpm seed             # Seed database with initial data

# Smart Contracts
pnpm test:contracts   # Run Clarity contract tests
pnpm clarinet:devnet  # Start Clarinet development network
```

### Adding New Games

#### React Game (Current Platform Standard)
1. Create directory: `apps/web/src/games/{game-name}/`
2. Add `index.tsx` with game logic and React components
3. Add `manifest.json` with game metadata
4. Implement `BitgameBridge` SDK for score submission
5. Add game thumbnail to `public/games/`
6. Update database with game information using seed script

**Example structure for new game:**
```
apps/web/src/games/new-game/
├── index.tsx          # Main game component
└── manifest.json      # Game configuration
```

### Game Manifest Schema

```json
{
  "name": "Game Name",
  "description": "Game description",
  "category": "puzzle|action|educational|sports",
  "type": "react",
  "thumbnail": "/games/game-thumb.png",
  "featured": false,
  "difficulty": "easy|medium|hard"
}
```

## 📜 Smart Contracts

### BIT Token (`bit-token.clar`)
- **Standard**: SIP-010 fungible token
- **Symbol**: BIT
- **Decimals**: 6
- **Features**: Minting, burning, transfers, metadata
- **Use Cases**: Tipping, rewards, in-game currency

### Game Registry (`game-registry.clar`)
- **Purpose**: On-chain game registration and score verification
- **Features**: 
  - Game registration with metadata
  - Score submission with hash verification
  - Player statistics tracking
  - Anti-cheat mechanisms

### Contract Deployment

```bash
cd apps/contracts
clarinet integrate
clarinet deploy
```

## 🌐 API Documentation

### Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://your-api-domain.vercel.app`

### Authentication
All endpoints use Stacks wallet authentication via signed messages.

### Endpoints

#### Games
```http
GET    /api/games                    # List all games
GET    /api/games/:slug              # Get game details
POST   /api/games/:slug/score        # Submit score
```

#### Social Feed
```http
GET    /api/feed                     # Get social feed (paginated)
POST   /api/feed/:id/like            # Like/unlike post
POST   /api/feed/:id/tip             # Record tip transaction
```

#### Leaderboard
```http
GET    /api/leaderboard/:slug        # Get game leaderboard
GET    /api/leaderboard/:slug/:limit # Get top N players
```

#### User Experience
```http
GET    /api/xp/:address              # Get user XP and level
POST   /api/xp/:address/add          # Add XP (admin only)
```

### Request/Response Examples

#### Submit Score
```http
POST /api/games/snake/score
Content-Type: application/json

{
  "playerAddress": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  "score": 1500,
  "metadata": {
    "level": 5,
    "time": 120
  },
  "shareMessage": "Just scored 1500 in Snake! 🐍",
  "template": {
    "background": "#1a1a1a",
    "textColor": "#ffffff"
  }
}
```

#### Social Feed Response
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "type": "score",
    "author": {
      "address": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "username": "player123",
      "avatar": "https://example.com/avatar.png"
    },
    "content": "Just scored 1500 in Snake! 🐍",
    "game": {
      "slug": "snake",
      "name": "Snake",
      "thumbnail": "/games/snake-thumb.png"
    },
    "score": 1500,
    "likes": 5,
    "tips": [
      {
        "from": "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
        "amount": 1000000,
        "txId": "0x123...",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

2. **Environment Variables**
   Set the following in Vercel dashboard:
   - `MONGODB_URI`
   - `STACKS_NETWORK`
   - `VITE_API_URL`
   - `VITE_STACKS_NETWORK`
   - `VITE_CONTRACT_ADDRESS`

3. **Custom Domains** (Optional)
   Configure custom domains in Vercel dashboard for production use.

### Manual Deployment

```bash
# Build all applications
pnpm build

# Deploy frontend
cd apps/web
vercel --prod

# Deploy backend
cd apps/api
vercel --prod
```

## 🧪 Testing

### Frontend Testing
```bash
cd apps/web
pnpm test
```

### Backend Testing
```bash
cd apps/api
pnpm test
```

### Smart Contract Testing
```bash
cd apps/contracts
clarinet test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting PR

### Code Style

- **Frontend**: ESLint + Prettier configuration included
- **Backend**: Standard JavaScript with consistent formatting
- **Contracts**: Follow Clarity best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stacks Foundation](https://stacks.org/) for blockchain infrastructure
- [Clarinet](https://clarity-lang.org/) for smart contract development tools
- [Vercel](https://vercel.com/) for deployment platform
- [MongoDB](https://www.mongodb.com/) for database hosting

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/bitgame/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/bitgame/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/bitgame/discussions)
- **Discord**: [Community Server](https://discord.gg/your-server)

---

<div align="center">
  <p>Built with ❤️ on the Stacks blockchain</p>
  <p>
    <a href="https://stacks.co/">Stacks</a> •
    <a href="https://clarity-lang.org/">Clarity</a> •
    <a href="https://reactjs.org/">React</a> •
    <a href="https://nodejs.org/">Node.js</a>
  </p>
</div>
