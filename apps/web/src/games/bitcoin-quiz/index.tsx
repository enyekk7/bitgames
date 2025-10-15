import { useState, useEffect, useCallback } from 'react';
import { useGameBridge } from '../../context/GameContext';

type BitcoinQuestion = {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct answer (0, 1, or 2)
  points: number;
};

export default function BitcoinQuizGame() {
  const bridge = useGameBridge(); // Get shared bridge instance
  const [currentQuestion, setCurrentQuestion] = useState<BitcoinQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Bitcoin questions database - 30 questions to prevent repetition
  const bitcoinQuestions: BitcoinQuestion[] = [
    {
      question: "Who created Bitcoin?",
      options: ["Satoshi Nakamoto", "Vitalik Buterin", "Elon Musk"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "In what year was Bitcoin first launched?",
      options: ["2008", "2009", "2010"],
      correctAnswer: 1,
      points: 10
    },
    {
      question: "What is the maximum total supply of Bitcoin?",
      options: ["21 million", "50 million", "100 million"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What consensus algorithm does Bitcoin use?",
      options: ["Proof of Stake", "Proof of Work", "Proof of Authority"],
      correctAnswer: 1,
      points: 10
    },
    {
      question: "What is the average time to generate one Bitcoin block?",
      options: ["5 minutes", "10 minutes", "15 minutes"],
      correctAnswer: 1,
      points: 10
    },
    {
      question: "What is the process of creating new Bitcoins called?",
      options: ["Mining", "Staking", "Farming"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "Who made the first real-world Bitcoin transaction?",
      options: ["Laszlo Hanyecz", "Satoshi Nakamoto", "Vitalik Buterin"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What contains the complete history of Bitcoin transactions?",
      options: ["Blockchain", "Ledger", "Database"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is the current Bitcoin block reward (2024)?",
      options: ["6.25 BTC", "12.5 BTC", "25 BTC"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What technology allows Bitcoin to function without banks?",
      options: ["Blockchain", "Cryptocurrency", "Decentralized Network"],
      correctAnswer: 2,
      points: 10
    },
    {
      question: "What is Bitcoin's smallest unit called?",
      options: ["Satoshi", "Wei", "Gwei"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "How many Satoshis equal 1 Bitcoin?",
      options: ["100 million", "1 billion", "10 billion"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is the process of Bitcoin reward reduction called?",
      options: ["Halving", "Reduction", "Cutting"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "How often does Bitcoin halving occur?",
      options: ["Every 2 years", "Every 4 years", "Every 6 years"],
      correctAnswer: 1,
      points: 10
    },
    {
      question: "What was Bitcoin's original block reward?",
      options: ["25 BTC", "50 BTC", "100 BTC"],
      correctAnswer: 1,
      points: 10
    },
    {
      question: "What is the maximum block size in Bitcoin?",
      options: ["1 MB", "2 MB", "4 MB"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's hash function?",
      options: ["SHA-256", "SHA-1", "MD5"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is the first Bitcoin block called?",
      options: ["Genesis Block", "Block Zero", "Origin Block"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's ticker symbol?",
      options: ["BTC", "BIT", "XBT"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is the process of validating Bitcoin transactions called?",
      options: ["Verification", "Confirmation", "Authentication"],
      correctAnswer: 1,
      points: 10
    },
    {
      question: "What is Bitcoin's difficulty adjustment period?",
      options: ["Every 2016 blocks", "Every 1000 blocks", "Every 5000 blocks"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's maximum transaction fee?",
      options: ["No limit", "1 BTC", "0.1 BTC"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's average transaction confirmation time?",
      options: ["10 minutes", "30 minutes", "1 hour"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's total market cap ranking?",
      options: ["#1 cryptocurrency", "#2 cryptocurrency", "#3 cryptocurrency"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's energy consumption compared to traditional banking?",
      options: ["Higher", "Lower", "Similar"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's privacy feature?",
      options: ["Pseudonymous", "Anonymous", "Public"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's inflation rate?",
      options: ["Decreasing", "Increasing", "Fixed"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's store of value characteristic?",
      options: ["Digital Gold", "Digital Silver", "Digital Currency"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's peer-to-peer nature?",
      options: ["No intermediaries", "Bank required", "Government controlled"],
      correctAnswer: 0,
      points: 10
    },
    {
      question: "What is Bitcoin's immutability feature?",
      options: ["Cannot be changed", "Can be modified", "Can be deleted"],
      correctAnswer: 0,
      points: 10
    }
  ];

  // Generate random Bitcoin question
  const generateQuestion = useCallback((): BitcoinQuestion => {
    const randomIndex = Math.floor(Math.random() * bitcoinQuestions.length);
    return bitcoinQuestions[randomIndex];
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          // Call bridge.gameOver when timer runs out
          console.log('₿ Bitcoin Quiz: Timer expired! Calling bridge.gameOver with score:', score);
          bridge.gameOver(score, { 
            questionsAnswered: questionNumber,
            correctAnswers: Math.floor(score / 10),
            timeExpired: true
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft, score, bridge, questionNumber]);

  // Generate first question when game starts
  useEffect(() => {
    if (gameStarted && !gameOver && !currentQuestion) {
      setCurrentQuestion(generateQuestion());
    }
  }, [gameStarted, gameOver, currentQuestion, generateQuestion]);

  // Note: endGame is called directly in handleAnswer and timer countdown
  // No need for separate useEffect to call endGame

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
        console.log('₿ Bitcoin Quiz: Game Over! Calling bridge.gameOver with score:', score + (correct ? currentQuestion.points : 0));
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
        setTimeLeft(10);
      }
    }, 2000);
  }, [currentQuestion, showResult, questionNumber, score, bridge, generateQuestion]);

  const endGame = useCallback(() => {
    setGameOver(true);
    console.log('₿ Bitcoin Quiz: Game Over! Calling bridge.gameOver with score:', score);
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
    setTimeLeft(10);
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
    setTimeLeft(10);
    setCurrentQuestion(null);
  };

  // Listen for reset events from PlayPage
  useEffect(() => {
    const handleReset = () => {
      console.log('🔄 Bitcoin Quiz: Received reset event, restarting game');
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
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: timeLeft <= 3 ? '#FF6B35' : '#FFD700' }}>
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
          background: '#FFD700',
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
            <div style={{ fontSize: '48px' }}>₿</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>Bitcoin Quiz</div>
            <div style={{ textAlign: 'center', color: '#000000', fontSize: '18px', fontWeight: 'bold' }}>
              Test your Bitcoin knowledge!<br />
              History, Technology & Facts<br />
              Choose A, B, or C
            </div>
            <button
              onClick={startGame}
              style={{
                padding: '16px 32px',
                background: '#000000',
                color: '#FFD700',
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
                            : '#FFD700')
                      : selectedAnswer === index
                        ? '#000000'
                        : '#FFD700',
                    color: showResult 
                      ? (index === currentQuestion.correctAnswer 
                          ? '#FFD700'
                          : selectedAnswer === index 
                            ? 'white'
                            : '#000000')
                      : selectedAnswer === index
                        ? '#FFD700'
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
                background: isCorrect ? '#FFD700' : '#ff4757',
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
            <div style={{ fontSize: '48px' }}>₿</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000' }}>Quiz Complete!</div>
            <div style={{ fontSize: '24px', color: '#000000', fontWeight: 'bold' }}>
              Final Score: {score} points
            </div>
            <div style={{ fontSize: '18px', color: '#000000', fontWeight: 'bold' }}>
              Correct Answers: {Math.floor(score / 10)}/10
            </div>
            
            {/* Debug info */}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              Bridge status: {bridge ? 'Connected' : 'Not connected'}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={endGame}
                style={{
                  padding: '12px 24px',
                  background: '#28a745',
                  color: 'white',
                  border: '3px solid #28a745',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                }}
              >
                🎯 Submit Score
              </button>
              
              <button
                onClick={restart}
                style={{
                  padding: '12px 24px',
                  background: '#000000',
                  color: '#FFD700',
                  border: '3px solid #000000',
                  borderRadius: '12px',
                  fontSize: '16px',
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
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
