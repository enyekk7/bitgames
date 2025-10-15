import { Link } from 'react-router-dom';
import { Game } from '../lib/api';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  console.log('GameCard - Game data:', game);
  console.log('GameCard - Thumbnail URL:', game.thumbnail);
  console.log('GameCard - Full thumbnail path:', window.location.origin + game.thumbnail);
  
  // Test if URL is accessible
  if (game.thumbnail) {
    console.log('🔍 Testing URL accessibility for:', game.thumbnail);
    fetch(game.thumbnail, { method: 'HEAD' })
      .then(response => {
        console.log('🔍 URL accessibility test:', response.status, response.ok);
        if (!response.ok) {
          console.log('🔍 Response not OK:', response.statusText);
        }
      })
      .catch(error => {
        console.log('🔍 URL accessibility test failed:', error);
        console.log('🔍 Error type:', error.name);
        console.log('🔍 Error message:', error.message);
      });
  }
  
  return (
    <Link 
      to={`/bitgame/${game.slug}`} 
      className="card game-card" 
      style={{ 
        textDecoration: 'none',
        border: '2px solid rgba(230, 126, 34, 0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(26, 26, 26, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(230, 126, 34, 0.4)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
        e.currentTarget.style.borderColor = 'rgba(230, 126, 34, 0.3)';
      }}
    >
      <div className="game-icon" style={{
        width: '100%',
        height: '240px',
        background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '72px',
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
              filter: 'drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.3))',
              display: 'block'
            }}
            onError={(e) => {
              console.log('❌ Image failed to load:', game.thumbnail);
              console.log('❌ Error details:', e);
              console.log('❌ Game name:', game.name);
              // Keep the image visible even if it fails to load
              e.currentTarget.style.display = 'block';
            }}
            onLoad={(_e) => {
              console.log('✅ Image loaded successfully:', game.thumbnail);
              console.log('✅ Game name:', game.name);
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {game.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.6)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {game.category}
        </div>
      </div>
      <div className="game-content" style={{ 
        padding: '20px 16px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderTop: '2px solid rgba(230, 126, 34, 0.5)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h3 className="game-title" style={{ 
          fontSize: '18px', 
          fontWeight: '700',
          textAlign: 'center',
          color: 'white',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {game.name}
        </h3>
        <p className="game-subtitle" style={{
          fontSize: '11px',
          color: 'rgba(230, 126, 34, 0.8)',
          textAlign: 'center',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {game.playCount > 0 
            ? `▶ ${game.playCount.toLocaleString()} plays`
            : '🎮 Play Now'
          }
        </p>
      </div>
    </Link>
  );
}


