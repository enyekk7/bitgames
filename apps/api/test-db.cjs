require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

console.log('🔗 Connecting to MongoDB Atlas...');
console.log('URI:', uri.replace(/:[^:]*@/, ':****@')); // Hide password

mongoose.connect(uri)
  .then(async () => {
    console.log('✅ MongoDB Connected!');
    
    // Define simple Game schema
    const gameSchema = new mongoose.Schema({
      slug: String,
      name: String,
      description: String,
      thumbnail: String,
      type: String,
      category: String,
      featured: Boolean,
      playCount: Number
    });
    
    const Game = mongoose.model('Game', gameSchema);
    
    // Clear and seed
    await Game.deleteMany({});
    console.log('🧹 Cleared games collection');
    
    const games = [
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
      }
    ];
    
    await Game.insertMany(games);
    console.log('✅ Seeded', games.length, 'games');
    
    const count = await Game.countDocuments();
    console.log('📊 Total games in DB:', count);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

