import { useState, useEffect } from 'react';
import { useGameBridge } from '../../context/GameContext';

type Player = 'X' | 'O' | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToeGame() {
  const bridge = useGameBridge(); // Get shared bridge instance
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const [gameStarted, setGameStarted] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState({ wins: 0, losses: 0 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  // Listen for reset events from PlayPage
  useEffect(() => {
    const handleReset = () => {
      console.log('🔄 TicTacToe: Received reset event, restarting game');
      setGameStarted(false);
      setBoard(Array(9).fill(null));
      setIsPlayerTurn(true);
      setGameOver(false);
      setWinner(null);
      setScore({ wins: 0, losses: 0, draws: 0 });
      setCurrentLevel(1);
      setLevelProgress({ wins: 0, losses: 0 });
      setShowLevelUp(false);
      setNewLevel(1);
    };

    bridge.on('reset-game', handleReset);

    return () => {
      bridge.off('reset-game', handleReset);
    };
  }, [bridge]);

  const checkWinner = (currentBoard: Board): Player | 'Draw' => {
    // Check winning combinations
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    
    // Check for draw
    if (currentBoard.every(cell => cell !== null)) {
      return 'Draw';
    }
    
    return null;
  };

  const getBotMove = (currentBoard: Board): number => {
    const difficulty = currentLevel;
    
    // Level 1-2: Random moves (very easy)
    if (difficulty <= 2) {
      const available = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
      return available[Math.floor(Math.random() * available.length)];
    }
    
    // Level 3-4: Sometimes blocks, sometimes random
    if (difficulty <= 4) {
      if (Math.random() < 0.3) {
        // 30% chance to block
        for (let i = 0; i < 9; i++) {
          if (!currentBoard[i]) {
            const testBoard = [...currentBoard];
            testBoard[i] = 'X';
            if (checkWinner(testBoard) === 'X') return i;
          }
        }
      }
      // Otherwise random
      const available = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
      return available[Math.floor(Math.random() * available.length)];
    }
    
    // Level 5-6: Always blocks, sometimes tries to win
    if (difficulty <= 6) {
      // Try to win (50% chance)
      if (Math.random() < 0.5) {
        for (let i = 0; i < 9; i++) {
          if (!currentBoard[i]) {
            const testBoard = [...currentBoard];
            testBoard[i] = 'O';
            if (checkWinner(testBoard) === 'O') return i;
          }
        }
      }
      
      // Block player from winning
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          const testBoard = [...currentBoard];
          testBoard[i] = 'X';
          if (checkWinner(testBoard) === 'X') return i;
        }
      }
      
      // Take center if available
      if (!currentBoard[4]) return 4;
      
      // Random move
      const available = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
      return available[Math.floor(Math.random() * available.length)];
    }
    
    // Level 7-8: Smart strategy with some randomness
    if (difficulty <= 8) {
      // Try to win
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          const testBoard = [...currentBoard];
          testBoard[i] = 'O';
          if (checkWinner(testBoard) === 'O') return i;
        }
      }

      // Block player from winning
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          const testBoard = [...currentBoard];
          testBoard[i] = 'X';
          if (checkWinner(testBoard) === 'X') return i;
        }
      }

      // Take center if available
      if (!currentBoard[4]) return 4;

      // Take corners (80% chance)
      if (Math.random() < 0.8) {
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => !currentBoard[i]);
        if (availableCorners.length > 0) {
          return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
      }

      // Take any available space
      const available = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
      return available[Math.floor(Math.random() * available.length)];
    }
    
    // Level 9-10: Perfect AI (original logic)
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'O';
        if (checkWinner(testBoard) === 'O') return i;
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'X';
        if (checkWinner(testBoard) === 'X') return i;
      }
    }

    // Take center if available
    if (!currentBoard[4]) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !currentBoard[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const available = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameOver || !gameStarted) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      endGame(result, newBoard);
      return;
    }

    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (!isPlayerTurn && !gameOver && gameStarted) {
      const timeout = setTimeout(() => {
        const botMove = getBotMove(board);
        const newBoard = [...board];
        newBoard[botMove] = 'O';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
          endGame(result, newBoard);
        } else {
          setIsPlayerTurn(true);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, gameOver, board, gameStarted]);

  const endGame = (result: Player | 'Draw', finalBoard: Board) => {
    setGameOver(true);
    setWinner(result);

    const newScore = { ...score };
    const newLevelProgress = { ...levelProgress };
    
    if (result === 'X') {
      newScore.wins++;
      newLevelProgress.wins++;
    } else if (result === 'O') {
      newScore.losses++;
      newLevelProgress.losses++;
    } else {
      newScore.draws++;
    }
    
    setScore(newScore);
    setLevelProgress(newLevelProgress);

    // Level progression logic - Auto level up on win
    if (result === 'X') {
      // Win 1 game to advance to next level
      if (currentLevel < 10) {
        const nextLevel = currentLevel + 1;
        setNewLevel(nextLevel);
        setShowLevelUp(true);
        // Level up popup will be handled by click
      }
    } else if (result === 'O') {
      // Lose 2 games to go back a level (minimum level 1)
      if (newLevelProgress.losses >= 2 && currentLevel > 1) {
        setCurrentLevel(prev => Math.max(1, prev - 1));
        setLevelProgress({ wins: 0, losses: 0 });
      }
    } else if (result === 'Draw') {
      // Draw doesn't affect level progression
      // Keep current level and progress
    }

    // Only call bridge.gameOver when player loses (to show popup)
    if (result === 'O') {
      // Calculate final score with level bonus
      const levelBonus = currentLevel * 10;
      const finalScore = newScore.wins * 100 - newScore.losses * 50 + newScore.draws * 25 + levelBonus;
      
      console.log('🎯 TicTacToe: Player lost, calling bridge.gameOver with score:', finalScore, 'Level:', currentLevel);
      
      // Add small delay to ensure smooth animation
      setTimeout(() => {
        // Submit score using shared bridge instance
        bridge.gameOver(Math.max(0, finalScore), { 
          wins: newScore.wins, 
          losses: newScore.losses, 
          draws: newScore.draws,
          level: currentLevel,
          levelProgress: newLevelProgress
        });
      }, 100); // Small delay for smooth animation
    } else {
      console.log('🎯 TicTacToe: Player won or draw, no popup needed');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setGameStarted(true);
    // Keep current level and progress
  };

  const startNewSession = () => {
    resetGame();
    setScore({ wins: 0, losses: 0, draws: 0 });
    setCurrentLevel(1);
    setLevelProgress({ wins: 0, losses: 0 });
    setGameStarted(true);
  };

  const getCellStyle = (index: number) => {
    const baseStyle: React.CSSProperties = {
      background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
      border: '3px solid white',
      borderRadius: '12px',
      fontSize: '48px',
      fontWeight: '900',
      cursor: board[index] || !isPlayerTurn || gameOver ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      color: board[index] === 'X' ? '#fff' : '#000',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      outline: 'none'
    };

    return baseStyle;
  };


  return (
    <>
      <style>
        {`
          body {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }
          html {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }
          #root {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translate(-50%, -50%) scale(0.8);
            }
            to { 
              opacity: 1; 
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '10px',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
      {/* Game Container */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        border: '2px solid rgba(230, 126, 34, 0.4)',
        maxWidth: '400px',
        width: '90%',
        maxHeight: '90vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(230, 126, 34, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(230, 126, 34, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        {/* Game Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ fontSize: '32px', marginBottom: '6px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))' }}>❌⭕</div>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: '900', 
            marginBottom: '2px',
            background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Tic Tac Toe</h1>
          <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '12px' }}>
            Play against the AI Bot!
          </p>
        </div>

        {/* Score Board */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '12px',
          background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.15) 0%, rgba(243, 156, 18, 0.1) 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(230, 126, 34, 0.3)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '8px', color: '#10B981', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wins</div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#10B981', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>{score.wins}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '8px', color: '#F59E0B', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Draws</div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#F59E0B', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>{score.draws}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '8px', color: '#EF4444', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Losses</div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#EF4444', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>{score.losses}</div>
          </div>
        </div>

        {/* Level Display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '12px',
          padding: '10px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ fontSize: '10px', color: '#3B82F6', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Level {currentLevel}
          </div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#3B82F6', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)', marginBottom: '4px' }}>
            {currentLevel <= 2 ? '🥉 Beginner' : 
             currentLevel <= 4 ? '🥈 Intermediate' : 
             currentLevel <= 6 ? '🥇 Advanced' : 
             currentLevel <= 8 ? '💎 Expert' : '👑 Master'}
          </div>
          <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>
            {currentLevel < 10 ? `Win 1 to Level ${currentLevel + 1}` : 'Max Level!'}
          </div>
          <div style={{ fontSize: '9px', color: '#9CA3AF' }}>
            {levelProgress.wins}/1 wins • {levelProgress.losses}/2 losses
          </div>
        </div>

        {/* Total Score */}
        <div style={{
          textAlign: 'center',
          marginBottom: '12px',
          fontSize: '12px',
          color: '#E67E22',
          fontWeight: '700',
          padding: '8px 12px',
          background: 'rgba(230, 126, 34, 0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(230, 126, 34, 0.3)',
          position: 'relative',
          zIndex: 1
        }}>
          Score: {score.wins * 100 - score.losses * 50 + score.draws * 25 + (currentLevel * 10)}
        </div>

        {/* Game Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '16px',
          maxWidth: '240px',
          margin: '0 auto 16px auto',
          position: 'relative',
          zIndex: 1
        }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              ...getCellStyle(index),
              width: '100%',
              height: '60px',
              fontSize: '24px',
              minHeight: '60px',
              aspectRatio: '1'
            }}
            onMouseEnter={(e) => {
              if (!cell && isPlayerTurn && !gameOver) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(230, 126, 34, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            }}
          >
            {cell}
          </button>
        ))}
      </div>

        {/* Game Status */}
        {!gameOver && (
          <div style={{ 
            fontSize: '16px', 
            color: '#aaa', 
            marginBottom: '16px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {isPlayerTurn ? "Your turn (X)" : "Bot is thinking (O)..."}
          </div>
        )}

        {/* Level Up Popup */}
        {showLevelUp && (
          <div 
            className="modal-overlay"
            onClick={() => {
              setShowLevelUp(false);
              setCurrentLevel(newLevel);
              setLevelProgress({ wins: 0, losses: 0 });
              setBoard(Array(9).fill(null));
              setIsPlayerTurn(true);
              setGameOver(false);
              setWinner(null);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <div 
              className="modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                textAlign: 'center',
                padding: '40px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderRadius: '20px',
                border: '3px solid #10B981',
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.5)',
                backdropFilter: 'blur(20px)',
                width: '90%',
                maxWidth: '400px',
                animation: 'slideUp 0.3s ease-out'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Level Clear!
              </div>
              <div style={{ fontSize: '20px', color: 'white', marginBottom: '16px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                Advancing to Level {newLevel}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Get ready for harder AI!
              </div>
            </div>
          </div>
        )}

        {/* Game Over Result - Show for loss or draw */}
        {gameOver && (winner === 'O' || winner === 'Draw') && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: winner === 'O' 
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.1) 100%)',
            borderRadius: '16px',
            marginBottom: '16px',
            border: winner === 'O' 
              ? '2px solid #EF4444'
              : '2px solid #6B7280',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '900', 
              marginBottom: '8px',
              color: winner === 'O' ? '#EF4444' : '#6B7280'
            }}>
              {winner === 'O' ? '🤖 Bot Wins!' : '🤝 Draw!'}
            </div>
          </div>
        )}

        {/* Win Result - Show for win (but not during level up) */}
        {gameOver && winner === 'X' && !showLevelUp && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
            borderRadius: '16px',
            marginBottom: '16px',
            border: '2px solid #10B981',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px', color: '#10B981' }}>
              🎉 You Win!
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          marginTop: '8px'
        }}>
          {gameOver && (
            <button
              onClick={resetGame}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(230, 126, 34, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 126, 34, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(230, 126, 34, 0.4)';
              }}
            >
              Play Again
            </button>
          )}
          <button
            onClick={startNewSession}
            style={{
              padding: '8px 16px',
              background: 'rgba(26, 26, 26, 0.8)',
              color: '#E67E22',
              border: '1px solid #E67E22',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E67E22';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
              e.currentTarget.style.color = '#E67E22';
            }}
          >
            New Session
          </button>
        </div>
      </div>
      </div>
    </>
  );
}

