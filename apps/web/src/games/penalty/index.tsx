import React, { useState, useEffect, useCallback } from 'react';
import { useGameBridge } from '../../context/GameContext';

interface PenaltyGameProps {
  onGameOver?: (score: number) => void;
}

export default function PenaltyGame({ onGameOver }: PenaltyGameProps) {
  const bridge = useGameBridge();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isShooting, setIsShooting] = useState(false);
  const [isKeeperActive, setIsKeeperActive] = useState(false);
  const [keeperDirection, setKeeperDirection] = useState(1);
  const [canRandomlyReverse, setCanRandomlyReverse] = useState(true);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#FFDC00');
  const [showMessage, setShowMessage] = useState(false);

  // Game elements refs
  const ballRef = React.useRef<HTMLImageElement>(null);
  const keeperRef = React.useRef<HTMLImageElement>(null);
  const goalRef = React.useRef<HTMLImageElement>(null);
  const gameContainerRef = React.useRef<HTMLDivElement>(null);

  // Audio refs
  const kickSoundRef = React.useRef<HTMLAudioElement>(null);
  const goalSoundRef = React.useRef<HTMLAudioElement>(null);
  const failSoundRef = React.useRef<HTMLAudioElement>(null);

  const playSound = useCallback((soundRef: React.RefObject<HTMLAudioElement>) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch((error) => console.log("Audio play failed:", error));
    }
  }, []);

  const updateKeeper = useCallback(() => {
    if (!isKeeperActive || !keeperRef.current || !goalRef.current || !gameContainerRef.current) return;
    
    const goalRect = goalRef.current.getBoundingClientRect();
    const keeperRect = keeperRef.current.getBoundingClientRect();
    
    // Calculate boundaries - more range for keeper movement
    const goalPadding = 0.05; // Reduced padding to 5% for more range
    const leftBoundary = goalPadding; // 5% from left
    const rightBoundary = 1 - goalPadding - (keeperRect.width / goalRect.width); // 5% from right
    
    // Increased speed for more dynamic movement
    const baseSpeed = 0.03; // Increased base speed
    const maxSpeed = 0.08; // Increased max speed
    const currentSpeed = Math.min(maxSpeed, baseSpeed + score * 0.005);
    
    // Get current position as percentage
    const currentTransform = keeperRef.current.style.transform;
    const currentTranslateX = currentTransform.includes('translateX') 
      ? parseFloat(currentTransform.match(/translateX\(([^)]+)\)/)?.[1] || '0') 
      : 0;
    const currentPosPercent = (currentTranslateX / goalRect.width) + 0.5; // Convert to 0-1 range
    
    const newPosPercent = currentPosPercent + (keeperDirection * currentSpeed);
    
    // Debug logging
    console.log('Keeper Debug:', {
      currentPosPercent,
      newPosPercent,
      leftBoundary,
      rightBoundary,
      currentSpeed,
      keeperDirection,
      goalWidth: goalRect.width,
      keeperWidth: keeperRect.width
    });
    
    // Ensure keeper stays within goal boundaries
    if (newPosPercent >= rightBoundary || newPosPercent <= leftBoundary) {
      setKeeperDirection(prev => prev * -1);
      setCanRandomlyReverse(false);
      setTimeout(() => setCanRandomlyReverse(true), 800); // Reduced timeout
    } else if (canRandomlyReverse && Math.random() < 0.02) { // Increased random reverse chance
      setKeeperDirection(prev => prev * -1);
      setCanRandomlyReverse(false);
      setTimeout(() => setCanRandomlyReverse(true), 800);
    }
    
    if (keeperRef.current) {
      // Clamp position to boundaries
      const clampedPosPercent = Math.max(leftBoundary, Math.min(rightBoundary, newPosPercent));
      const translateX = (clampedPosPercent - 0.5) * goalRect.width;
      keeperRef.current.style.transform = `translateX(${translateX}px)`;
    }
    
    requestAnimationFrame(updateKeeper);
  }, [isKeeperActive, keeperDirection, score, canRandomlyReverse]);

  const resetRound = useCallback(() => {
    if (!ballRef.current || !keeperRef.current || !goalRef.current || !gameContainerRef.current) return;
    
    // Reset ball position
    ballRef.current.style.left = "50%";
    ballRef.current.style.top = "";
    ballRef.current.style.bottom = "30%";
    ballRef.current.style.transform = "translateX(-50%)";
    
    // Reset keeper to center with slight random offset
    const randomOffset = (Math.random() - 0.5) * 20; // Random offset between -10 and 10
    keeperRef.current.style.transform = `translateX(${randomOffset}px)`;
    
    console.log('Reset Keeper: Centered with offset', randomOffset);
    
    setIsShooting(false);
    setIsKeeperActive(true);
    setKeeperDirection(Math.random() < 0.5 ? 1 : -1);
    setCanRandomlyReverse(true); // Reset random reverse capability
  }, []);

  const shootBall = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isShooting || !ballRef.current || !goalRef.current || !gameContainerRef.current) return;
    
    setIsShooting(true);
    playSound(kickSoundRef);

    const containerRect = gameContainerRef.current.getBoundingClientRect();
    const clickX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const goalRect = goalRef.current.getBoundingClientRect();
    const goalTopBoundary = goalRect.top + goalRect.height * 0.3;
    const goalHorizontalPadding = goalRect.width * 0.06;
    
    const isClickInGoal =
      clickX >= goalRect.left + goalHorizontalPadding &&
      clickX <= goalRect.right - goalHorizontalPadding &&
      clickY >= goalTopBoundary &&
      clickY <= goalRect.top + goalRect.height * 0.7;
    
    if (!isClickInGoal) {
      setIsShooting(false);
      return;
    }

    const ballRect = ballRef.current.getBoundingClientRect();
    const startX = ballRect.left - containerRect.left + ballRect.width / 2;
    const startY = ballRect.top - containerRect.top + ballRect.height / 2;
    const endX = clickX - containerRect.left;
    const endY = clickY - containerRect.top;
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 15;
    const steps = distance / speed;
    let currentStep = 0;

    const animate = () => {
      try {
        if (currentStep / steps >= 1) {
          setIsKeeperActive(false);
          if (ballRef.current) {
            ballRef.current.style.left = `${endX - ballRect.width / 2}px`;
            ballRef.current.style.top = `${endY - ballRect.height / 2}px`;
          }
          
          // Check collision after a short delay to ensure positions are updated
          setTimeout(() => {
            const finalBallRect = ballRef.current?.getBoundingClientRect();
            const keeperRect = keeperRef.current?.getBoundingClientRect();
            
            if (finalBallRect && keeperRect) {
              const horizontalPadding = keeperRect.width * 0.2;
              const keeperHitbox = {
                left: keeperRect.left + horizontalPadding,
                right: keeperRect.right - horizontalPadding,
                top: keeperRect.top + keeperRect.height * 0.2,
                bottom: keeperRect.bottom,
              };
              
              const isCaught =
                finalBallRect.right > keeperHitbox.left &&
                finalBallRect.left < keeperHitbox.right &&
                finalBallRect.bottom > keeperHitbox.top &&
                finalBallRect.top < keeperHitbox.bottom;
              
              console.log('Collision Check:', { isCaught, finalBallRect, keeperRect, keeperHitbox });
              
              if (isCaught) {
                handleMiss();
              } else {
                handleGoal();
              }
            } else {
              console.log('Missing elements for collision check');
              handleGoal(); // Default to goal if can't check collision
            }
          }, 50);
          return;
        }
        
        currentStep++;
        const progress = currentStep / steps;
        const currentX = startX + dx * progress;
        const currentY = startY + dy * progress;
        
        if (ballRef.current) {
          ballRef.current.style.left = `${currentX - ballRect.width / 2}px`;
          ballRef.current.style.top = `${currentY - ballRect.height / 2}px`;
          ballRef.current.style.transform = "none";
        }
        
        requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error:', error);
        setIsShooting(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isShooting, playSound]);

  const handleGoal = useCallback(() => {
    try {
      const newScore = score + 1;
      setScore(newScore);
      setMessage("GOAL!");
      setMessageColor("#FFDC00");
      setShowMessage(true);
      playSound(goalSoundRef);
      
      console.log('Goal scored! New score:', newScore);
      
      setTimeout(() => {
        setShowMessage(false);
        resetRound();
      }, 1500);
    } catch (error) {
      console.error('Handle goal error:', error);
    }
  }, [score, playSound, resetRound]);

  const handleMiss = useCallback(() => {
    try {
      const newLives = lives - 1;
      setLives(newLives);
      setMessage("MISSED!");
      setMessageColor("#FF4136");
      setShowMessage(true);
      playSound(failSoundRef);
      
      console.log('Missed! Lives left:', newLives);
      
      if (newLives > 0) {
        setTimeout(() => {
          setShowMessage(false);
          resetRound();
        }, 1500);
      } else {
        setTimeout(() => {
          setShowMessage(false);
          endGame();
        }, 1500);
      }
    } catch (error) {
      console.error('Handle miss error:', error);
    }
  }, [lives, playSound, resetRound]);

  const endGame = useCallback(() => {
    setGameOver(true);
    console.log('⚽ Penalty: Game Over! Calling bridge.gameOver with score:', score);
    bridge.gameOver(score, { 
      livesUsed: 3 - lives,
      goalsScored: score
    });
  }, [score, bridge, lives]);

  const showGameOver = useCallback(() => {
    setIsKeeperActive(false);
    alert("Game Over!\nSkor kamu: " + score);
    endGame();
  }, [score, endGame]);

  const restartGame = useCallback(() => {
    setLives(3);
    setScore(0);
    setGameOver(false);
    resetRound();
  }, [resetRound]);

  const showMessageFunc = useCallback((text: string, color: string) => {
    setMessage(text);
    setMessageColor(color);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  }, []);

  // Start game when component mounts
  useEffect(() => {
    if (!gameStarted) {
      console.log('🎮 Penalty Game Starting...');
      setGameStarted(true);
      resetRound();
    }
  }, [gameStarted, resetRound]);

  // Debug keeper visibility
  useEffect(() => {
    if (keeperRef.current) {
      console.log('🥅 Keeper element found:', {
        element: keeperRef.current,
        style: {
          position: keeperRef.current.style.position,
          left: keeperRef.current.style.left,
          top: keeperRef.current.style.top,
          display: keeperRef.current.style.display,
          visibility: keeperRef.current.style.visibility
        }
      });
    }
  }, [gameStarted]);

  // Update keeper animation
  useEffect(() => {
    if (isKeeperActive) {
      updateKeeper();
    }
  }, [isKeeperActive, updateKeeper]);

  // Fallback mechanism to prevent keeper from getting stuck
  useEffect(() => {
    if (isKeeperActive) {
      const fallbackTimer = setInterval(() => {
        if (keeperRef.current && goalRef.current) {
          const currentTransform = keeperRef.current.style.transform;
          const currentTranslateX = currentTransform.includes('translateX') 
            ? parseFloat(currentTransform.match(/translateX\(([^)]+)\)/)?.[1] || '0') 
            : 0;
          
          // If keeper hasn't moved much, force a direction change
          if (Math.abs(currentTranslateX) < 10) {
            console.log('Keeper stuck detected, forcing direction change');
            setKeeperDirection(prev => prev * -1);
            setCanRandomlyReverse(false);
            setTimeout(() => setCanRandomlyReverse(true), 500);
          }
        }
      }, 3000); // Check every 3 seconds

      return () => clearInterval(fallbackTimer);
    }
  }, [isKeeperActive]);

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      endGame();
    }
  }, [gameOver, endGame]);

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .penalty-game-container {
              max-width: 100vw !important;
              height: 100vh !important;
              border-radius: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div 
          ref={gameContainerRef}
          className="penalty-game-container"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            height: '600px',
            background: 'url("https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/Latar-yXt0WyAv5CUVlvzjD1d2kpmeJbcaye.png?3UDs") no-repeat center center',
            backgroundSize: 'cover',
            cursor: 'pointer',
            touchAction: 'none',
            overflow: 'hidden',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '3px solid #333'
          }}
          onClick={shootBall}
          onTouchStart={(e) => {
            e.preventDefault();
            shootBall(e);
          }}
        >
      {/* Lives Container */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        display: 'flex',
        gap: '5px',
        zIndex: 20
      }}>
        {Array.from({ length: 3 }, (_, i) => (
          <img
            key={i}
            style={{
              height: '30px',
              width: 'auto',
              filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.6))',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: i >= lives ? 'scale(0)' : 'scale(1)',
              opacity: i >= lives ? 0 : 1
            }}
            src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/Bola-paya4lVYPBq37eaiVyzilDdGk6W9Vb.png?0sfi"
            alt={`Nyawa ${i + 1}`}
          />
        ))}
      </div>

      {/* Score Container */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.7), rgba(40, 40, 40, 0.6))',
        color: '#ffdc00',
        padding: '6px 12px',
        borderRadius: '10px',
        fontSize: '20px',
        fontWeight: '900',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 20
      }}>
        SKOR: <span style={{ color: 'white' }}>{score}</span>
      </div>

      {/* Goal */}
      <img
        ref={goalRef}
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: 'auto'
        }}
        src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/Gawng-haDpS2YMCsaOay1Vfd81uRbtk97JKu.png?grUd"
        alt="Goal"
      />

      {/* Keeper */}
      <img
        ref={keeperRef}
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          width: '35%',
          height: 'auto',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'block'
        }}
        src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/20251015_163307-aKrcset6qL9UZIEYVVoiuOqzoLEsMZ.png?LRDz"
        alt="Keeper"
      />

      {/* Ball */}
      <img
        ref={ballRef}
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '15%',
          height: 'auto'
        }}
        src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/Bola-paya4lVYPBq37eaiVyzilDdGk6W9Vb.png?0sfi"
        alt="Ball"
      />

      {/* Message */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          fontSize: '15vw',
          fontWeight: 'bold',
          color: messageColor,
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8)',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: showMessage ? 1 : 0,
          transform: showMessage ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.5)',
          transition: 'all 0.3s ease'
        }}
      >
        {message}
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '20px' }}>
            Game Over!
          </h2>
          <p style={{ color: 'white', fontSize: '1.5rem', marginBottom: '30px' }}>
            Skor kamu: {score}
          </p>
          <button
            onClick={restartGame}
            style={{
              padding: '10px 20px',
              fontSize: '1.2rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Main Lagi
          </button>
        </div>
      )}

        {/* Audio Elements */}
        <audio
          ref={kickSoundRef}
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/Kick-D372WNTW7EeBsEmu9TFMvFZ2T0kkb5.mp3?th9r"
          preload="auto"
        />
        <audio
          ref={goalSoundRef}
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/goal%20%281%29-RSXN35C5k9eFv76R1sc138sk1lBsgJ.mp3?ZI9s"
          preload="auto"
        />
        <audio
          ref={failSoundRef}
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/7f72e5ed-ba42-42dc-abda-e7b1117cd4b3/Fail-b04kC28C2LNsmlOYM0mys9lndjCtCZ.mp3?ivyf"
          preload="auto"
        />
      </div>
    </div>
    </>
  );
}
