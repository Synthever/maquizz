'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface QuizQuestion {
  question: string;
  answer: number;
  operation: string;
  level: string;
}

interface QuizEpisode {
  _id: string;
  operation: string;
  level: string;
  episode: number;
  questions: QuizQuestion[];
  timeLimit: number;
  pointsPerQuestion: number;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  totalPoints: number;
  completedEpisodes: Array<{
    operation: string;
    level: string;
    episode: number;
    score: number;
    timeCompleted: Date;
  }>;
}

export default function QuizPage() {
  const [user, setUser] = useState<User | null>(null);
  const [quiz, setQuiz] = useState<QuizEpisode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{
    pointsEarned: number;
    isPerfect: boolean;
    isNewBest: boolean;
    bestScore?: number;
    attempts: number;
  } | null>(null);
  const [starPositions] = useState(() => 
    [...Array(50)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3
    }))
  );
  
  const router = useRouter();
  const params = useParams();
  const operation = params.operation as string;
  const level = params.level as string;
  const episode = parseInt(params.episode as string);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchQuiz();
    } catch {
      router.push('/auth/login');
    }
  }, [router, operation, level, episode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameEnded]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz?operation=${operation}&level=${level}&episode=${episode}`);
      const data = await response.json();
      
      if (response.ok) {
        setQuiz(data);
        setTimeLeft(data.timeLimit);
      } else {
        console.error('Failed to fetch quiz:', data.error);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const submitAnswer = () => {
    if (!quiz || !userAnswer.trim()) return;

    const answer = parseInt(userAnswer);
    const correct = answer === quiz.questions[currentQuestion].answer;
    
    if (correct) {
      setScore(score + 1);
    }
    
    setAnswers([...answers, answer]);
    setUserAnswer('');

    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setGameEnded(true);
    
    if (!quiz || !user) return;

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation,
          level,
          episode,
          score,
          userId: user._id,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update user data in localStorage with fresh data
        const userResponse = await fetch(`/api/auth/user/${user._id}`);
        if (userResponse.ok) {
          const updatedUserData = await userResponse.json();
          localStorage.setItem('user', JSON.stringify(updatedUserData.user));
          setUser(updatedUserData.user);
        } else {
          // Fallback: just update points locally
          const updatedUser = {
            ...user,
            totalPoints: user.totalPoints + (data.pointsEarned || 0),
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        
        // Store additional result info for display
        setQuizResult(data);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Quiz not found</div>
      </div>
    );
  }

  const operationInfo = {
    addition: { name: 'Addition', icon: '➕' },
    subtraction: { name: 'Subtraction', icon: '➖' },
    multiplication: { name: 'Multiplication', icon: '✖️' },
    division: { name: 'Division', icon: '➗' },
    mixed: { name: 'Mixed Operations', icon: '🎯' },
  }[operation] || { name: 'Unknown', icon: '❓' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Stars Background */}
      <div className="stars-container absolute inset-0">
        {starPositions.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl">
          
          {!gameStarted ? (
            // Pre-game screen
            <div className="text-center">
              <div className="text-6xl mb-4">{operationInfo.icon}</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {operationInfo.name} - {level.charAt(0).toUpperCase() + level.slice(1)} Level
              </h1>
              <div className="text-xl text-gray-300 mb-6">Episode {episode}</div>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-gray-300">Questions</div>
                    <div className="text-white font-bold text-xl">{quiz.questions.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Time Limit</div>
                    <div className="text-white font-bold text-xl">{formatTime(quiz.timeLimit)}</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Points per Question</div>
                    <div className="text-yellow-400 font-bold text-xl">{quiz.pointsPerQuestion}</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Max Points</div>
                    <div className="text-yellow-400 font-bold text-xl">{quiz.questions.length * quiz.pointsPerQuestion}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
              >
                🚀 Start Mission
              </button>
            </div>
          ) : gameEnded ? (
            // Post-game screen
            <div className="text-center">
              <div className="text-6xl mb-4">
                {score >= quiz.questions.length * 0.8 ? '🎉' : score >= quiz.questions.length * 0.6 ? '👏' : '💪'}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {score === 10 ? '🌟 Perfect Mission!' : 'Mission Complete!'}
              </h1>
              
              {quizResult && (
                <div className="mb-4">
                  {quizResult.isPerfect && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg mb-4">
                      ✨ Perfect Score! All questions correct!
                    </div>
                  )}
                  {quizResult.isNewBest && quizResult.attempts > 1 && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg mb-4">
                      🎯 New Best Score! Previous best: {quizResult.bestScore || 'N/A'}/10
                    </div>
                  )}
                  {!quizResult.isNewBest && quizResult.attempts > 1 && (
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-lg mb-4">
                      🔄 Attempt #{quizResult.attempts} - Best Score: {quizResult.bestScore}/10
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-gray-300">Score</div>
                    <div className="text-white font-bold text-2xl">{score}/{quiz.questions.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Accuracy</div>
                    <div className="text-white font-bold text-2xl">{Math.round((score / quiz.questions.length) * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Points Earned</div>
                    <div className="text-yellow-400 font-bold text-2xl">
                      +{quizResult ? quizResult.pointsEarned : score * quiz.pointsPerQuestion}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-300">Total Points</div>
                    <div className="text-yellow-400 font-bold text-2xl">{user.totalPoints}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                {/* Next Episode Button (if not perfect and more episodes available) */}
                {score === 10 && episode < (level === 'extreme' ? 3 : 5) && (
                  <Link href={`/quiz/${operation}/${level}/${episode + 1}`}>
                    <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                      🚀 Next Episode
                    </button>
                  </Link>
                )}
                
                {/* Retry Button */}
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  🔄 Retry Episode
                </button>
                
                <Link href={`/quiz/${operation}`}>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                    📚 Choose Episode
                  </button>
                </Link>
                
                <Link href="/dashboard">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                    🏠 Dashboard
                  </button>
                </Link>
              </div>
              
              {/* Episode Progress Info */}
              <div className="mt-6 bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-3">Episode Progress</h3>
                <div className="text-gray-300 text-sm">
                  <p>Operation: <span className="text-white font-semibold">{operationInfo.name}</span></p>
                  <p>Level: <span className="text-white font-semibold">{level.charAt(0).toUpperCase() + level.slice(1)}</span></p>
                  <p>Episode: <span className="text-white font-semibold">{episode}</span></p>
                  {quizResult && (
                    <p>Attempts: <span className="text-white font-semibold">{quizResult.attempts}</span></p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Game screen
            <div>
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="text-white">
                  <span className="text-lg">Question {currentQuestion + 1} of {quiz.questions.length}</span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-300">Time Left</div>
                </div>
                <div className="text-white text-right">
                  <div className="text-lg">Score: {score}/{quiz.questions.length}</div>
                  <div className="text-sm text-yellow-400">{score * quiz.pointsPerQuestion} points</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2 mb-8">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <div className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {quiz.questions[currentQuestion].question} = ?
                </div>
                
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your answer"
                  className="w-full max-w-md mx-auto px-6 py-4 text-2xl text-center bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  Submit Answer
                </button>
                <div className="text-gray-400 text-sm mt-2">Press Enter to submit</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
