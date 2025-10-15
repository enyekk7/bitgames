# 🏗️ Architecture Documentation

## Overview

Bitgame is a Web3 gaming platform built on Stacks blockchain, featuring:
- Multiple mini-games (React & HTML)
- Social feed for sharing scores
- On-chain tipping with BIT tokens (SIP-010)
- Wallet integration (Leather/Xverse)

## Technology Stack

### Frontend
- **Framework**: Vite + React 18 + TypeScript
- **Routing**: React Router v6
- **Wallet**: @stacks/connect, @stacks/transactions
- **Styling**: CSS (Custom properties/variables)

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Blockchain**: Stacks SDK for read-only calls

### Smart Contracts
- **Language**: Clarity
- **Development**: Clarinet
- **Standards**: SIP-010 (Fungible Tokens)

### Monorepo
- **Package Manager**: pnpm workspaces
- **Structure**: apps/ + tools/

## Project Structure

```
bitgame/
├─ apps/
│  ├─ web/              # Frontend React app
│  │  ├─ src/
│  │  │  ├─ components/  # Reusable UI components
│  │  │  ├─ routes/      # Page components
│  │  │  ├─ games/       # React games
│  │  │  ├─ wallet/      # Wallet integration
│  │  │  ├─ sdk/         # Game bridge SDK
│  │  │  └─ lib/         # API client
│  │  └─ public/
│  │     └─ games-host/  # Synced HTML games
│  │
│  ├─ api/              # Backend Express server
│  │  └─ src/
│  │     ├─ models/     # Mongoose schemas
│  │     ├─ routes/     # API endpoints
│  │     └─ config/     # Configuration
│  │
│  └─ contracts/        # Clarity smart contracts
│     └─ contracts/
│        ├─ bit-token.clar
│        └─ game-registry.clar
│
├─ games-external/      # HTML game sources
│  ├─ snake/
│  │  ├─ manifest.json
│  │  └─ index.html
│  └─ math-quiz/
│
└─ tools/               # Build & sync tools
   └─ sync-games.ts
```

## Data Flow

### 1. Game Play Flow

```
User clicks "Play" 
  → Navigate to /bitgame/:slug/play
  → PlayPage checks if React game exists
    → YES: Load React component dynamically
    → NO: Load HTML in iframe from /games-host/:slug
  → Game ends, triggers BitgameBridge.gameOver()
  → Submit score to API
  → Show ShareModal
  → User shares or skips
  → Redirect to feed
```

### 2. Score Submission Flow

```
Game ends
  → BitgameBridge.gameOver(score, metadata)
  → POST /api/games/:slug/score
    ├─ Upsert user in database
    ├─ Save score document
    ├─ Increment game play count
    └─ Create post if shareMessage provided
  → Return { score, post }
```

### 3. Tipping Flow

```
User clicks "Tip" on post
  → Show tip modal
  → User enters amount
  → Call sendTip() → wallet opens
  → User confirms transaction
  → Get txId from wallet
  → POST /api/feed/:postId/tip { from, amount, txId }
  → Save tip in database
  → Add tip to post.tips array
```

### 4. Feed Flow

```
Load feed page
  → GET /api/feed
  → Fetch posts with populated data:
    ├─ User info (username, avatar)
    ├─ Game info (name, thumbnail)
    └─ Engagement (likes, reposts, tips)
  → Render PostCard components
  → User interacts (like/repost/tip)
```

## Database Schema

### User
```typescript
{
  stxAddress: string;      // Unique Stacks address
  username?: string;       // Optional display name
  avatar?: string;         // Avatar URL
  createdAt: Date;
  lastLoginAt: Date;
}
```

### Game
```typescript
{
  slug: string;            // URL-friendly identifier
  name: string;
  description: string;
  thumbnail: string;
  type: 'react' | 'html';
  category: string;
  featured: boolean;
  playCount: number;
  onChainId?: number;     // Game registry ID
  createdAt: Date;
}
```

### Score
```typescript
{
  gameSlug: string;
  playerAddress: string;
  score: number;
  metadata?: object;      // Game-specific data
  txHash?: string;        // On-chain tx (optional)
  createdAt: Date;
}
```

### Post
```typescript
{
  type: 'score' | 'repost';
  author: string;         // Stacks address
  content: string;
  gameSlug?: string;
  score?: number;
  scoreId?: ObjectId;
  originalPostId?: ObjectId;
  likes: string[];        // Array of addresses
  reposts: number;
  tips: [{
    from: string;
    amount: number;
    txId: string;
    timestamp: Date;
  }];
  createdAt: Date;
}
```

### Tip
```typescript
{
  from: string;
  to: string;
  amount: number;
  postId?: ObjectId;
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}
```

## Smart Contracts

### bit-token.clar (SIP-010 FT)

**Functions:**
- `transfer(amount, sender, recipient, memo)` - Transfer tokens
- `mint(amount, recipient)` - Mint new tokens (admin only)
- `burn(amount, owner)` - Burn tokens
- `get-balance(who)` - Read balance
- `get-total-supply()` - Read total supply

### game-registry.clar

**Functions:**
- `register-game(uri, name)` - Register game (admin only)
- `submit-score(game-id, score, hash)` - Submit score with replay protection
- `toggle-game-status(game-id)` - Enable/disable game (admin only)
- `get-game(game-id)` - Read game data
- `get-player-score(game-id, player)` - Read player's best score

**Anti-Replay Protection:**
Uses `score-hashes` map to prevent duplicate submissions with same payload hash.

## API Endpoints

### Games
- `GET /api/games` - List all games
- `GET /api/games/:slug` - Get game details
- `POST /api/games/:slug/score` - Submit score

### Leaderboard
- `GET /api/leaderboard/:slug` - Get top scores

### Feed
- `GET /api/feed` - Get timeline posts
- `POST /api/feed/:id/like` - Like/unlike post
- `POST /api/feed/:id/repost` - Repost to feed
- `POST /api/feed/:id/tip` - Record tip transaction

### Auth
- `GET /api/auth/nonce` - Get signing nonce
- `POST /api/auth/verify` - Verify signature

## Wallet Integration

### Connection Flow
```typescript
showConnect() 
  → User selects wallet (Leather/Xverse)
  → Wallet prompts authentication
  → Returns userData with addresses
  → Store in app state
```

### Reading Balance
```typescript
callReadOnlyFunction({
  contractAddress,
  contractName: 'bit-token',
  functionName: 'get-balance',
  functionArgs: [principalCV(address)]
})
```

### Sending Tip
```typescript
openContractCall({
  contractName: 'bit-token',
  functionName: 'transfer',
  functionArgs: [amount, sender, recipient, memo],
  postConditions: [fungibleTokenCondition]
})
```

## Game SDK (BitgameBridge)

### Purpose
Enables communication between games and portal.

### Usage in React Games
```typescript
import BitgameBridge from '../../sdk/BitgameBridge';

const bridge = new BitgameBridge();
bridge.gameOver(score, { level: 5 });
```

### Usage in HTML Games
```javascript
window.parent.postMessage({
  type: 'bitgame',
  event: 'game-over',
  data: { score: 1000, metadata: {} }
}, '*');
```

### Portal Listening
```typescript
bridge.on('game-over', (data) => {
  submitScore(data.score, data.metadata);
});
```

## Game Sync System

### External Games
1. Create game in `games-external/{slug}/`
2. Add `manifest.json` and `index.html`
3. Run `pnpm sync:games`
4. Files copied to `apps/web/public/games-host/{slug}/`

### React Games
1. Create game in `apps/web/src/games/{slug}/`
2. Add `index.tsx` and `manifest.json`
3. Dynamic import in PlayPage
4. No sync needed

## Security Considerations

### Frontend
- Input validation before API calls
- Sanitize user-generated content
- Wallet signature verification (planned)

### Backend
- Rate limiting (TODO)
- MongoDB injection prevention (Mongoose)
- CORS configuration

### Smart Contracts
- Access control (admin-only functions)
- Replay protection (hash tracking)
- Post conditions for transfers

## Performance Optimizations

### Frontend
- Lazy loading for game components
- Code splitting by route
- Image optimization (TODO)

### Backend
- MongoDB indexes on frequently queried fields
- Aggregation pipelines for leaderboards
- Connection pooling

### Database Indexes
```javascript
// Score indexes
{ gameSlug: 1, score: -1 }       // Leaderboard
{ gameSlug: 1, playerAddress: 1 } // Player scores

// Post indexes
{ createdAt: -1 }                 // Feed timeline
{ author: 1 }                     // User posts
```

## Future Enhancements

1. **Real-time Updates**: WebSocket for live feed
2. **NFT Integration**: Game achievements as NFTs
3. **Tournament System**: Scheduled competitions
4. **Revenue Sharing**: Creator rewards from tips
5. **Mobile Apps**: React Native versions
6. **Analytics Dashboard**: Player statistics
7. **Moderation Tools**: Content filtering
8. **Multi-language**: i18n support



