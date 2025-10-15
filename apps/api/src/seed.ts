import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { Game } from './models/Game.js';
import { User } from './models/User.js';

dotenv.config();

const seedGames = [
  {
    slug: 'snake',
    name: 'Snake Game',
    description: 'Classic snake game. Eat food, grow longer, avoid walls!',
    thumbnail: '/games/snake-thumb.png',
    type: 'react',
    category: 'arcade',
    featured: true,
    playCount: 0
  },
  {
    slug: 'math-quiz',
    name: 'Math Quiz',
    description: 'Test your math skills with multiplication and division!',
    thumbnail: '/games/math-quiz-thumb.png',
    type: 'react',
    category: 'educational',
    featured: true,
    playCount: 0
  },
  {
    slug: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe game vs AI Bot!',
    thumbnail: '/games/tictactoe-thumb.png',
    type: 'react',
    category: 'puzzle',
    featured: true,
    playCount: 0
  },
  {
    slug: 'bitcoin-quiz',
    name: 'Bitcoin Quiz',
    description: 'Test your Bitcoin knowledge! History, technology and facts.',
    thumbnail: '/games/bitcoin-quiz-thumb.png',
    type: 'react',
    category: 'educational',
    featured: true,
    playCount: 0
  },
  {
    slug: 'penalty',
    name: 'Penalty',
    description: 'Score goals in this exciting penalty shootout game!',
    thumbnail: '/games/penalty-thumb.png',
    type: 'react',
    category: 'sports',
    featured: true,
    playCount: 0
  },
  {
    slug: 'stacks-quiz',
    name: 'Stacks Quiz',
    description: 'Test your knowledge about Stacks blockchain and Bitcoin Layer 2 technology!',
    thumbnail: '/games/stacks-quiz-thumb.png',
    type: 'react',
    category: 'educational',
    featured: true,
    playCount: 0
  }
];

async function seed() {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing games
    await Game.deleteMany({});
    console.log('  ✓ Cleared games');

    // Insert seed games
    await Game.insertMany(seedGames);
    console.log('  ✓ Added games:', seedGames.map(g => g.name).join(', '));

    // Create demo user
    await User.findOneAndUpdate(
      { stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM' },
      {
        stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        username: 'demo_player',
        lastLoginAt: new Date()
      },
      { upsert: true }
    );
    console.log('  ✓ Created demo user');

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();


