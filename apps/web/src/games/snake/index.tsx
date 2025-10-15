import { useState, useEffect, useCallback } from 'react';
import { useGameBridge } from '../../context/GameContext';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

type Position = { x: number; y: number };

export default function SnakeGame() {
  const bridge = useGameBridge(); // Get shared bridge instance
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

  const checkCollision = (head: Position) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  };

  const moveSnake = useCallback(() => {
    if (gameOver || paused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
      };

      if (checkCollision(newHead)) {
        setGameOver(true);
        console.log('🐍 Snake: Game Over! Calling bridge.gameOver with score:', score);
        bridge.gameOver(score, { length: prevSnake.length, finalScore: score });
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, paused, score, generateFood, bridge]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [moveSnake]);

  // Listen for reset events from PlayPage
  useEffect(() => {
    const handleReset = () => {
      console.log('🔄 Snake: Received reset event, restarting game');
      restart();
    };

    bridge.on('reset-game', handleReset);

    return () => {
      bridge.off('reset-game', handleReset);
    };
  }, [bridge]);

  const restart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setPaused(false);
    // Generate new food position
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  };

  const handleTouch = (newDirection: string) => {
    if (gameOver) {
      restart();
      return;
    }
    
    if (newDirection === 'up' && direction.y === 0) setDirection({ x: 0, y: -1 });
    else if (newDirection === 'down' && direction.y === 0) setDirection({ x: 0, y: 1 });
    else if (newDirection === 'left' && direction.x === 0) setDirection({ x: -1, y: 0 });
    else if (newDirection === 'right' && direction.x === 0) setDirection({ x: 1, y: 0 });
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#111',
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Game Canvas */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        background: 'black',
        border: '1px solid #333'
      }}>
        {/* Background Grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'black'
        }}>
          {/* Grid lines */}
          {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
            <div key={`v-${i}`} style={{
              position: 'absolute',
              left: i * CELL_SIZE,
              top: 0,
              bottom: 0,
              width: '1px',
              background: '#222'
            }} />
          ))}
          {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
            <div key={`h-${i}`} style={{
              position: 'absolute',
              top: i * CELL_SIZE,
              left: 0,
              right: 0,
              height: '1px',
              background: '#222'
            }} />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              background: 'orange'
            }}
          />
        ))}

        {/* Food */}
        <div
          style={{
            position: 'absolute',
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            background: 'red'
          }}
        />

        {/* Score */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '22px',
          fontFamily: 'Arial'
        }}>
          {score}
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Arial'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
              Game Over
            </div>
            <div style={{ fontSize: '18px', marginBottom: '20px' }}>
              Final Score: {score}
            </div>
            <div style={{ fontSize: '14px' }}>
              Touch screen to restart
            </div>
          </div>
        )}

        {/* Paused Screen */}
        {paused && !gameOver && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            PAUSED
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <div style={{
            display: 'grid',
            gridTemplateAreas: `
              ". up ."
              "left center right"
              ". down ."
            `,
            gap: '8px'
          }}>
            <div 
              className="control-button up" 
              data-direction="up"
              onClick={() => handleTouch('up')}
              style={{
                gridArea: 'up',
                width: '65px',
                height: '65px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2em',
                color: 'rgba(255, 255, 255, 0.7)',
                userSelect: 'none',
                cursor: 'pointer'
              }}
            >
              ⬆
            </div>
            <div 
              className="control-button left" 
              data-direction="left"
              onClick={() => handleTouch('left')}
              style={{
                gridArea: 'left',
                width: '65px',
                height: '65px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2em',
                color: 'rgba(255, 255, 255, 0.7)',
                userSelect: 'none',
                cursor: 'pointer'
              }}
            >
              ⬅
            </div>
            <div 
              className="control-button center" 
              style={{
                gridArea: 'center',
                display: 'none'
              }}
            />
            <div 
              className="control-button right" 
              data-direction="right"
              onClick={() => handleTouch('right')}
              style={{
                gridArea: 'right',
                width: '65px',
                height: '65px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2em',
                color: 'rgba(255, 255, 255, 0.7)',
                userSelect: 'none',
                cursor: 'pointer'
              }}
            >
              ➡
            </div>
            <div 
              className="control-button down" 
              data-direction="down"
              onClick={() => handleTouch('down')}
              style={{
                gridArea: 'down',
                width: '65px',
                height: '65px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2em',
                color: 'rgba(255, 255, 255, 0.7)',
                userSelect: 'none',
                cursor: 'pointer'
              }}
            >
              ⬇
            </div>
          </div>
        </div>
      )}

    </div>
  );
}