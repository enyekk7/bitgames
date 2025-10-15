import { useState, useEffect, useCallback } from 'react';
import { useGameBridge } from '../../context/GameContext';

type MathQuestion = {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct answer (0, 1, or 2)
  points: number;
};

export default function MathQuizGame() {
  const bridge = useGameBridge(); // Get shared bridge instance
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  // Generate math questions
  const generateQuestion = useCallback((): MathQuestion => {
    const operations = ['×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question = '';
    let correctAnswer = 0;
    let options: string[] = [];
    
    if (operation === '×') {
      // Multiplication questions
      const a = Math.floor(Math.random() * 12) + 1; // 1-12
      const b = Math.floor(Math.random() * 12) + 1; // 1-12
      const answer = a * b;
      question = `${a} × ${b} = ?`;
      
      // Generate wrong answers
      const wrong1 = answer + Math.floor(Math.random() * 20) + 1;
      const wrong2 = Math.max(1, answer - Math.floor(Math.random() * 20) - 1);
      
      options = [answer.toString(), wrong1.toString(), wrong2.toString()];
      // Shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      correctAnswer = options.indexOf(answer.toString());
    } else {
      // Division questions
      const b = Math.floor(Math.random() * 12) + 1; // 1-12
      const answer = Math.floor(Math.random() * 12) + 1; // 1-12
      const a = b * answer; // Ensure clean division
      question = `${a} ÷ ${b} = ?`;
      
      // Generate wrong answers
      const wrong1 = answer + Math.floor(Math.random() * 5) + 1;
      const wrong2 = Math.max(1, answer - Math.floor(Math.random() * 5) - 1);
      
      options = [answer.toString(), wrong1.toString(), wrong2.toString()];
      // Shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      correctAnswer = options.indexOf(answer.toString());
    }
    
    return {
      question,
      options,
      correctAnswer,
      points: 10
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          // Call bridge.gameOver when time runs out
          console.log('🧮 Math Quiz: Time Up! Calling bridge.gameOver with score:', score);
          bridge.gameOver(score, { 
            questionsAnswered: questionNumber,
            correctAnswers: Math.floor(score / 10),
            timeUp: true
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft, score, questionNumber, bridge]);

  // Generate first question when game starts
  useEffect(() => {
    if (gameStarted && !gameOver && !currentQuestion) {
      setCurrentQuestion(generateQuestion());
    }
  }, [gameStarted, gameOver, currentQuestion, generateQuestion]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + currentQuestion.points);
    }
    
    // Show result for 2 seconds, then next question
    setTimeout(() => {
      if (questionNumber >= 10) {
        // End game after 10 questions
        setGameOver(true);
        console.log('🧮 Math Quiz: Game Over! Calling bridge.gameOver with score:', score + (correct ? currentQuestion.points : 0));
        bridge.gameOver(score + (correct ? currentQuestion.points : 0), { 
          questionsAnswered: questionNumber,
          correctAnswers: score / 10 + (correct ? 1 : 0)
        });
      } else {
        // Next question
        setQuestionNumber(prev => prev + 1);
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
        setTimeLeft(5);
      }
    }, 2000);
  }, [currentQuestion, showResult, questionNumber, score, bridge, generateQuestion]);

  const endGame = useCallback(() => {
    setGameOver(true);
    console.log('🧮 Math Quiz: Game Over! Calling bridge.gameOver with score:', score);
    bridge.gameOver(score, { 
      questionsAnswered: questionNumber,
      correctAnswers: Math.floor(score / 10)
    });
  }, [score, bridge, questionNumber]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
    setQuestionNumber(1);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setTimeLeft(5);
    setCurrentQuestion(null);
  };

  const restart = () => {
    setGameStarted(false);
    setScore(0);
    setGameOver(false);
    setQuestionNumber(1);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setTimeLeft(5);
    setCurrentQuestion(null);
  };

  // Listen for reset events from PlayPage
  useEffect(() => {
    const handleReset = () => {
      console.log('🔄 Math Quiz: Received reset event, restarting game');
      restart();
    };

    bridge.on('reset-game', handleReset);

    return () => {
      bridge.off('reset-game', handleReset);
    };
  }, [bridge]);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        maxWidth: '600px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Score: {score}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: timeLeft <= 2 ? '#FF6B35' : '#FF6B35' }}>
          Time: {timeLeft}s
        </div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Q: {questionNumber}/10
        </div>
      </div>

      {/* Game Area */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          background: '#FF6B35',
          borderRadius: '20px',
          padding: '40px',
          border: '3px solid #000000',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}
      >
        {!gameStarted && !gameOver && (
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px'
          }}>
            <div style={{ fontSize: '48px' }}>🧮</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>Math Quiz</div>
            <div style={{ textAlign: 'center', color: '#000000', fontSize: '18px', fontWeight: 'bold' }}>
              Answer 10 math questions!<br />
              Multiplication and Division<br />
              Choose A, B, or C
            </div>
            <button
              onClick={startGame}
              style={{
                padding: '16px 32px',
                background: '#000000',
                color: '#FF6B35',
                border: '3px solid #000000',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}
            >
              Start Quiz
            </button>
          </div>
        )}

        {gameStarted && !gameOver && currentQuestion && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '30px', color: '#000000' }}>
              {currentQuestion.question}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  style={{
                    padding: '20px',
                    background: showResult 
                      ? (index === currentQuestion.correctAnswer 
                          ? '#000000'
                          : selectedAnswer === index 
                            ? '#ff4757'
                            : '#FF6B35')
                      : selectedAnswer === index
                        ? '#000000'
                        : '#FF6B35',
                    color: showResult 
                      ? (index === currentQuestion.correctAnswer 
                          ? '#FF6B35'
                          : selectedAnswer === index 
                            ? 'white'
                            : '#000000')
                      : selectedAnswer === index
                        ? '#FF6B35'
                        : '#000000',
                    border: '3px solid #000000',
                    borderRadius: '12px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: showResult && index !== currentQuestion.correctAnswer && selectedAnswer !== index ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div style={{
                marginTop: '30px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: isCorrect ? '#000000' : '#ff4757',
                background: isCorrect ? '#FF6B35' : '#ff4757',
                padding: '10px 20px',
                borderRadius: '10px',
                border: '3px solid #000000'
              }}>
                {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
              </div>
            )}
          </div>
        )}

        {gameOver && (
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ fontSize: '48px' }}>🎉</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000' }}>Quiz Complete!</div>
            <div style={{ fontSize: '24px', color: '#000000', fontWeight: 'bold' }}>
              Final Score: {score} points
            </div>
            <div style={{ fontSize: '18px', color: '#000000', fontWeight: 'bold' }}>
              Correct Answers: {Math.floor(score / 10)}/10
            </div>
            <button
              onClick={restart}
              style={{
                padding: '16px 32px',
                background: '#000000',
                color: '#FF6B35',
                border: '3px solid #000000',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


