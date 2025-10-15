import { useState, useEffect } from 'react';
import { useGameBridge } from '../../context/GameContext';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const allQuestions: Question[] = [
  {
    question: "What is Stacks?",
    options: [
      "A Bitcoin Layer 2 blockchain",
      "A new cryptocurrency",
      "A Bitcoin wallet",
      "A DeFi protocol"
    ],
    correct: 0,
    explanation: "Stacks is a Bitcoin Layer 2 blockchain that enables smart contracts and DeFi on Bitcoin."
  },
  {
    question: "What is sBTC?",
    options: [
      "A Bitcoin-backed asset on Stacks",
      "A new cryptocurrency",
      "A Bitcoin wallet",
      "A DeFi protocol"
    ],
    correct: 0,
    explanation: "sBTC is a 1:1 Bitcoin-backed asset that unlocks BTC's capital on Stacks."
  },
  {
    question: "What programming language does Stacks use?",
    options: [
      "Clarity",
      "Solidity",
      "Rust",
      "JavaScript"
    ],
    correct: 0,
    explanation: "Stacks uses Clarity, a security-first programming language with visibility on Bitcoin state."
  },
  {
    question: "What is Proof of Transfer (PoX)?",
    options: [
      "A consensus mechanism that uses Bitcoin",
      "A new mining algorithm",
      "A staking mechanism",
      "A transaction type"
    ],
    correct: 0,
    explanation: "Proof of Transfer (PoX) is Stacks' consensus mechanism that uses Bitcoin as the base layer."
  },
  {
    question: "What is the Nakamoto upgrade?",
    options: [
      "A major Stacks upgrade for Bitcoin finality",
      "A new cryptocurrency",
      "A Bitcoin wallet",
      "A DeFi protocol"
    ],
    correct: 0,
    explanation: "The Nakamoto upgrade brings Bitcoin finality to Stacks, making transactions as irreversible as Bitcoin's."
  },
  {
    question: "What is Stacking?",
    options: [
      "Earning rewards by participating in consensus",
      "A new mining method",
      "A transaction type",
      "A wallet feature"
    ],
    correct: 0,
    explanation: "Stacking is the process of earning rewards by participating in Stacks consensus."
  },
  {
    question: "What is BNS (Bitcoin Name Service)?",
    options: [
      "A naming system for Bitcoin addresses",
      "A new cryptocurrency",
      "A Bitcoin wallet",
      "A DeFi protocol"
    ],
    correct: 0,
    explanation: "BNS is a naming system that allows human-readable names for Bitcoin addresses."
  },
  {
    question: "What is the main advantage of building on Stacks?",
    options: [
      "Bitcoin security and network effects",
      "Lower fees",
      "Faster transactions",
      "More privacy"
    ],
    correct: 0,
    explanation: "The main advantage is leveraging Bitcoin's security and network effects as the base layer."
  },
  {
    question: "What is Clarity's main feature?",
    options: [
      "Security-first programming with Bitcoin visibility",
      "Faster execution",
      "Lower gas fees",
      "More privacy"
    ],
    correct: 0,
    explanation: "Clarity is designed for security with visibility on Bitcoin state and predictable execution."
  },
  {
    question: "What is the Stacks ecosystem focused on?",
    options: [
      "Activating Bitcoin's latent capital",
      "Creating new cryptocurrencies",
      "Building new wallets",
      "Developing new consensus mechanisms"
    ],
    correct: 0,
    explanation: "Stacks focuses on activating Bitcoin's latent capital through DeFi and smart contracts."
  }
];

// Function to shuffle questions and options
const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Shuffle options for each question
  return shuffled.slice(0, 10).map(question => {
    const options = [...question.options];
    const correctAnswer = options[question.correct];
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Find new correct index
    const newCorrectIndex = options.findIndex(option => option === correctAnswer);
    
    return {
      ...question,
      options,
      correct: newCorrectIndex
    };
  });
};

export default function StacksQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const bridge = useGameBridge();

  useEffect(() => {
    if (!gameStarted || gameOver || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          // Call bridge.gameOver when time runs out
          console.log('🧠 Stacks Quiz: Time Up! Calling bridge.gameOver with score:', score);
          console.log('🧠 Stacks Quiz: Bridge instance:', bridge);
          console.log('🧠 Stacks Quiz: Current question:', currentQuestion);
          console.log('🧠 Stacks Quiz: Correct answers so far:', correctAnswers);
          
          if (bridge) {
            bridge.gameOver(score, {
              questionsAnswered: currentQuestion + 1,
              correctAnswers: correctAnswers,
              timeUp: true
            });
            console.log('🧠 Stacks Quiz: bridge.gameOver() called successfully (timeout)');
          } else {
            console.error('🧠 Stacks Quiz: Bridge is null! (timeout)');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, bridge]);

  const startGame = () => {
    const shuffledQuestions = shuffleQuestions(allQuestions);
    setQuestions(shuffledQuestions);
    setGameStarted(true);
    setTimeLeft(10);
    setScore(0);
    setCurrentQuestion(0);
    setGameOver(false);
    setCorrectAnswers(0);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || gameOver) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      const points = Math.max(10, 10 - timeLeft);
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(10);
      } else {
        setGameOver(true);
        const finalCorrectAnswers = correctAnswers + (answerIndex === questions[currentQuestion].correct ? 1 : 0);
        console.log('🧠 Stacks Quiz: Game Over! Calling bridge.gameOver with score:', score);
        console.log('🧠 Stacks Quiz: Bridge instance:', bridge);
        console.log('🧠 Stacks Quiz: Final correct answers:', finalCorrectAnswers);
        console.log('🧠 Stacks Quiz: Questions answered:', questions.length);
        
        if (bridge) {
          bridge.gameOver(score, {
            questionsAnswered: questions.length,
            correctAnswers: finalCorrectAnswers,
            timeUp: false
          });
          console.log('🧠 Stacks Quiz: bridge.gameOver() called successfully');
        } else {
          console.error('🧠 Stacks Quiz: Bridge is null!');
        }
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(10);
    setCorrectAnswers(0);
    setShowResult(false);
    setQuestions([]);
  };

  if (!gameStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a0a00 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(26, 26, 26, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '2px solid #E67E22',
          boxShadow: '0 20px 60px rgba(230, 126, 34, 0.3)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Stacks Quiz
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#aaa',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Test your knowledge about Stacks blockchain and Bitcoin Layer 2 technology!
          </p>
          <div style={{
            background: 'rgba(230, 126, 34, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid rgba(230, 126, 34, 0.3)'
          }}>
            <h3 style={{ color: '#E67E22', marginBottom: '12px' }}>Game Rules:</h3>
            <ul style={{ textAlign: 'left', color: '#ccc', lineHeight: '1.8' }}>
              <li>10 questions about Stacks blockchain</li>
              <li>10 seconds per question</li>
              <li>Score based on speed and accuracy</li>
              <li>Learn about Bitcoin Layer 2 technology</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            style={{
              background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '700',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a0a00 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(26, 26, 26, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '2px solid #E67E22',
          boxShadow: '0 20px 60px rgba(230, 126, 34, 0.3)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Quiz Complete!
          </h1>
          <div style={{
            fontSize: '24px',
            color: '#E67E22',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Score: {score.toLocaleString()}
          </div>
          <div style={{
            fontSize: '18px',
            color: '#aaa',
            marginBottom: '24px'
          }}>
            Correct: {correctAnswers}/{questions.length}
          </div>
          <button
            onClick={resetGame}
            style={{
              background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '700',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  
  if (!question) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a0a00 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading question...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0a00 50%, #000000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(26, 26, 26, 0.9)',
        padding: '40px',
        borderRadius: '20px',
        border: '2px solid #E67E22',
        boxShadow: '0 20px 60px rgba(230, 126, 34, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '900',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Stacks Quiz
            </h1>
            <div style={{ color: '#aaa', fontSize: '14px' }}>
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <div style={{
            textAlign: 'right',
            color: '#E67E22',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            Score: {score.toLocaleString()}
          </div>
        </div>

        {/* Timer */}
        <div style={{
          background: 'rgba(230, 126, 34, 0.1)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: timeLeft <= 3 ? '#ff4444' : '#E67E22'
          }}>
            {timeLeft}s
          </div>
        </div>

        {/* Question */}
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          {question.question}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correct;
            const isWrong = isSelected && !isCorrect;
            
            let buttonStyle = {
              padding: '16px 20px',
              borderRadius: '12px',
              border: '2px solid #333',
              background: 'rgba(26, 26, 26, 0.8)',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left' as const
            };

            if (showResult) {
              if (isCorrect) {
                buttonStyle.background = 'rgba(0, 255, 0, 0.2)';
                buttonStyle.border = '2px solid #00ff00';
              } else if (isWrong) {
                buttonStyle.background = 'rgba(255, 0, 0, 0.2)';
                buttonStyle.border = '2px solid #ff4444';
              }
            } else if (isSelected) {
              buttonStyle.background = 'rgba(230, 126, 34, 0.2)';
              buttonStyle.border = '2px solid #E67E22';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null || gameOver}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (selectedAnswer === null && !gameOver) {
                    e.currentTarget.style.background = 'rgba(230, 126, 34, 0.1)';
                    e.currentTarget.style.border = '2px solid #E67E22';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer === null && !gameOver) {
                    e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
                    e.currentTarget.style.border = '2px solid #333';
                  }
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(230, 126, 34, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(230, 126, 34, 0.3)'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#E67E22',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Explanation:
            </div>
            <div style={{
              fontSize: '14px',
              color: '#ccc',
              lineHeight: '1.6'
            }}>
              {question.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
