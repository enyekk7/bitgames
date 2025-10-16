import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import GameCard from '../components/GameCard';

// Fallback games data when API is not available
const FALLBACK_GAMES = [
  {
    _id: '1',
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
    _id: '2',
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
    _id: '3',
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
    _id: '4',
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
    _id: '5',
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
    _id: '6',
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

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await api.getGames();
      setGames(data);
    } catch (error) {
      console.error('Failed to load games from API, using fallback data:', error);
      // Use fallback games if API fails
      setGames(FALLBACK_GAMES);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(games.map(g => g.category))];
  const filteredGames = filter === 'all' ? games : games.filter(g => g.category === filter);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="flex-center" style={{ minHeight: '400px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading games...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ 
          marginBottom: '24px', 
          fontSize: '32px', 
          fontWeight: '700',
          paddingBottom: '16px',
          borderBottom: '3px solid var(--primary)',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Games
        </h1>

        <div style={{ 
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '10px 20px',
                background: filter === cat 
                  ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' 
                  : 'rgba(26, 26, 26, 0.8)',
                border: filter === cat ? '2px solid var(--primary)' : '2px solid var(--border)',
                borderRadius: '20px',
                color: 'white',
                fontWeight: filter === cat ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: filter === cat 
                  ? '0 4px 12px rgba(230, 126, 34, 0.4)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filteredGames.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎮</div>
            <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>No games found</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try a different category
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '20px'
          }}
          className="games-grid"
          >
            {filteredGames.map((game, index) => (
              <div 
                key={game._id}
                style={{ 
                  animation: `fadeIn 0.4s ease-out ${index * 0.1}s backwards`
                }}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
