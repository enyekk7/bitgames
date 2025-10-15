import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Game } from '../lib/api';
import { GameProvider, useGameBridge } from '../context/GameContext';
import ShareModal from '../components/ShareModal';

// Direct imports for games
import SnakeGame from '../games/snake/index';
import MathQuizGame from '../games/math-quiz/index';
import BitcoinQuizGame from '../games/bitcoin-quiz/index';
import TicTacToeGame from '../games/tictactoe/index';
import PenaltyGame from '../games/penalty/index';
import StacksQuizGame from '../games/stacks-quiz/index';

// Fallback games data
const FALLBACK_GAMES: Record<string, Game> = {
  'snake': {
    _id: '1',
    slug: 'snake',
    name: 'Snake Game',
    description: 'Classic snake game. Eat food, grow longer, avoid walls!',
    thumbnail: 'https://lqy3lriiybxcejon.public.blob.vercel-storage.com/d8cfc203-18c4-4dd1-8f01-27b4ad38815d/1_20251015_112200_0000-2XyctHm4JY0batq1a2Zh5nYA7ZDUhC.png?v=' + Date.now(),
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
  'penalty': {
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

interface PlayPageProps {
  walletAddress: string | null;
}

function PlayPageContent({ walletAddress }: PlayPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const bridge = useGameBridge(); // Get shared bridge instance
  const [game, setGame] = useState<Game | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [metadata, setMetadata] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    // Redirect old coindrop URL to new math-quiz URL
    if (slug === 'coindrop') {
      navigate('/bitgame/math-quiz', { replace: true });
      return;
    }
    
    if (slug) {
      loadGame();
    }
  }, [slug, navigate]);

  useEffect(() => {
    console.log('🔧 PlayPage: Setting up game-over listener for game:', slug);
    console.log('🔧 PlayPage: Wallet address:', walletAddress);
    console.log('🔧 PlayPage: Bridge instance:', bridge);
    
    const handleGameOver = async (data: any) => {
      console.log('🎮 PlayPage: Game Over event received!', data);
      console.log('🎮 PlayPage: Score:', data.score);
      console.log('🎮 PlayPage: Metadata:', data.metadata);
      setFinalScore(data.score);
      setMetadata(data.metadata);
      setGameOver(true);
      
      // Update XP if wallet is connected
      if (walletAddress && slug) {
        try {
          console.log('📈 Updating XP for player:', walletAddress);
          console.log('📈 Score:', data.score);
          console.log('📈 Game slug:', slug);
          
          const xpResult = await bridge.updateXP(walletAddress, data.score, slug);
          console.log('✅ XP updated:', xpResult);
          
          // Store XP data in metadata for display
          setMetadata(prev => ({
            ...prev,
            xpGained: xpResult.xpGained,
            leveledUp: xpResult.leveledUp,
            newAchievements: xpResult.newAchievements
          }));
          
          // Show level up notification if applicable
          if (xpResult.leveledUp) {
            console.log('🎉 Level up! New achievements:', xpResult.newAchievements);
          } else {
            console.log(`✅ You gained ${xpResult.xpGained} XP!`);
          }
        } catch (error) {
          console.error('❌ Failed to update XP:', error);
        }
      } else {
        console.log('⚠️ Cannot update XP - wallet not connected or slug missing');
        console.log('⚠️ Wallet address:', walletAddress);
        console.log('⚠️ Game slug:', slug);
      }
      
      // Show share modal only if wallet is connected
      if (walletAddress) {
        console.log('✅ Wallet connected, showing share modal');
        console.log('✅ Game slug:', slug);
        console.log('✅ Final score:', data.score);
        setShowShareModal(true);
      } else {
        console.warn('⚠️ Wallet not connected, cannot share score');
        console.warn('⚠️ Wallet address:', walletAddress);
        setShowShareModal(false);
      }
    };

    bridge.on('game-over', handleGameOver);

    return () => {
      console.log('🧹 PlayPage: Cleaning up game-over listener');
      bridge.off('game-over', handleGameOver);
    };
  }, [slug, walletAddress, bridge]);

  const loadGame = async () => {
    if (!slug) return;
    try {
      const gameData = await api.getGame(slug);
      setGame(gameData);
      
      // Check if React game exists, otherwise use iframe
      if (gameData.type === 'html') {
        setUseIframe(true);
      }
    } catch (error) {
      console.error('Failed to load game from API, using fallback:', error);
      // Use fallback game if API fails
      setGame(FALLBACK_GAMES[slug] || null);
    }
  };

  const handleShare = async (shareData: string) => {
    if (!walletAddress || !slug) {
      console.warn('⚠️ No wallet connected or game slug missing');
      return;
    }

    try {
      // Parse share data (message + template)
      const parsedData = JSON.parse(shareData);
      const { message, template } = parsedData;
      
      console.log('📤 Sharing score to feed:', { score: finalScore, message, template });
      console.log('🎨 Template data:', JSON.stringify(template, null, 2));
      
      // Submit score WITH share message and template - this will create a post
      const result = await api.submitScore(slug, {
        playerAddress: walletAddress,
        score: finalScore,
        metadata,
        shareMessage: message,
        template: template
      });
      
      console.log('✅ Share successful!', result);
      
      // Reset game state to allow playing again instead of navigating away
      setGameOver(false);
      setFinalScore(0);
      setMetadata(null);
      setShowShareModal(false); // Hide share modal
      bridge.emit('reset-game'); // Reset the game component
    } catch (error) {
      console.error('❌ Failed to share:', error);
      throw error;
    }
  };

  const handleSkip = async () => {
    if (!walletAddress || !slug) {
      // Reset game state to allow playing again
      setGameOver(false);
      setFinalScore(0);
      setMetadata(null);
      setShowShareModal(false); // Hide share modal
      bridge.emit('reset-game'); // Reset the game component
      return;
    }

    try {
      console.log('⏭️ Skipping share, just saving score');
      
      // Submit score WITHOUT share message - no post created
      await api.submitScore(slug, {
        playerAddress: walletAddress,
        score: finalScore,
        metadata
      });
      
      // Reset game state to allow playing again instead of navigating away
      setGameOver(false);
      setFinalScore(0);
      setMetadata(null);
      setShowShareModal(false); // Hide share modal
      bridge.emit('reset-game'); // Reset the game component
    } catch (error) {
      console.error('❌ Failed to save score:', error);
      // Reset game state even if save fails
      setGameOver(false);
      setFinalScore(0);
      setMetadata(null);
      setShowShareModal(false); // Hide share modal
      bridge.emit('reset-game'); // Reset the game component
    }
  };

  if (!game) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading game...</p>
      </div>
    );
  }

  // Render game component based on slug
  const renderGame = () => {
    if (useIframe) {
      return (
        <iframe
          src={`/games-host/${slug}/index.html`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title={game.name}
        />
      );
    }

    // Direct component rendering (no lazy loading issues)
    switch (slug) {
      case 'snake':
        return <SnakeGame />;
      case 'math-quiz':
        return <MathQuizGame />;
      case 'bitcoin-quiz':
        return <BitcoinQuizGame />;
      case 'tictactoe':
        return <TicTacToeGame />;
      case 'penalty':
        return <PenaltyGame />;
      case 'stacks-quiz':
        return <StacksQuizGame />;
      default:
        return (
          <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px'
          }}>
            Game not found
          </div>
        );
    }
  };

  return (
    <>
      <style>
        {`
          body {
            overflow-x: hidden;
            overflow-y: auto !important;
          }
          html {
            overflow-x: hidden;
            overflow-y: auto !important;
          }
        `}
      </style>
      <div style={{ 
        minHeight: '100vh', 
        background: '#000', 
        position: 'relative', 
        overflow: 'visible',
        width: '100%',
        height: 'auto'
      }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid var(--primary)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(247, 147, 26, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(247, 147, 26, 0.2)';
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(247, 147, 26, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(247, 147, 26, 0.3)';
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {renderGame()}

      {gameOver && showShareModal && (
        <>
          {console.log('🎯 ShareModal rendering:', { gameOver, showShareModal, slug, gameName: game.name, finalScore })}
          <ShareModal
            gameSlug={slug!}
            gameName={game.name}
            score={finalScore}
            onShare={handleShare}
            onClose={() => {
              setShowShareModal(false);
              // Don't call handleSkip here to avoid double execution
            }}
            onPlayAgain={() => {
              setGameOver(false);
              setFinalScore(0);
              setMetadata(null);
              setShowShareModal(false);
              bridge.emit('reset-game');
            }}
          />
        </>
      )}

      </div>
    </>
  );
}

// Wrap with GameProvider to share bridge instance
export default function PlayPage(props: PlayPageProps) {
  return (
    <GameProvider>
      <PlayPageContent {...props} />
    </GameProvider>
  );
}

