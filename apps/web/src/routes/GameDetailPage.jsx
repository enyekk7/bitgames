import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

// Fallback games data
const FALLBACK_GAMES = {
  'snake': {
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
  'math-quiz': {
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
  'tictactoe': {
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
  'bitcoin-quiz': {
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
  'stacks-quiz': {
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
};

export default function GameDetailPage() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadGameData();
    }
  }, [slug]);

  const loadGameData = async () => {
    if (!slug) return;
    try {
      const [gameData, leaderboardData] = await Promise.all([
        api.getGame(slug),
        api.getLeaderboard(slug, 10)
      ]);
      setGame(gameData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to load game from API, using fallback:', error);
      // Use fallback game if API fails
      setGame(FALLBACK_GAMES[slug] || null);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="flex-center" style={{ minHeight: '400px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="page">
        <div className="container">
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '8px' }}>Game not found</h2>
            <Link to="/games" className="btn btn-primary mt-2">
              Browse Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{
                width: '100%',
                height: '200px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {game.thumbnail ? (
                  <img 
                    src={game.thumbnail} 
                    alt={game.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.3))'
                    }}
                    onError={(e) => {
                      console.log('❌ Game detail image failed to load:', game.thumbnail);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  fontSize: '60px'
                }}>
                  🎮
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                  {game.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px', fontSize: '14px' }}>
                  {game.description}
                </p>
                <div className="flex gap-2">
                  <Link to={`/bitgame/${game.slug}/play`} className="btn btn-primary" style={{ flex: 1 }}>
                    ▶ Play Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                🏆 Leaderboard
              </h2>
              {leaderboard.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                  No scores yet. Be the first!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={entry.playerAddress}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: index === 0 ? 'var(--primary)' : 'var(--bg-hover)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700',
                        width: '24px',
                        textAlign: 'center'
                      }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${entry.rank}`}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                          {entry.username || `${entry.playerAddress.slice(0, 8)}...`}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', color: index === 0 ? 'white' : 'var(--primary)' }}>
                        {entry.score.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
