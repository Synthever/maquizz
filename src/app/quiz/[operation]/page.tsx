'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

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

interface EpisodeProgress {
  score: number;
  bestScore: number;
  isPerfect: boolean;
  attempts: number;
  timeCompleted: string;
}

interface ProgressData {
  progressMap: { [key: number]: EpisodeProgress };
  nextEpisode: number;
  totalEpisodes: number;
  completedCount: number;
  perfectCount: number;
}

export default function QuizSelection() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<{ [key: string]: ProgressData }>({});
  const router = useRouter();
  const params = useParams();
  const operation = params.operation as string;

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
      fetchAllProgress(parsedUser._id);
    } catch {
      router.push('/auth/login');
    }
  }, [router, operation]);

  const fetchAllProgress = async (userId: string) => {
    const levels = ['easy', 'medium', 'hard', 'extreme'];
    const progressPromises = levels.map(level => 
      fetch(`/api/progress?userId=${userId}&operation=${operation}&level=${level}`)
        .then(res => res.json())
        .then(data => ({ level, data }))
    );

    try {
      const results = await Promise.all(progressPromises);
      const progressMap: { [key: string]: ProgressData } = {};
      
      results.forEach(({ level, data }) => {
        progressMap[level] = data;
      });
      
      setProgressData(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEpisodeStatus = (level: string, episodeNum: number) => {
    const progress = progressData[level];
    if (!progress || !progress.progressMap[episodeNum]) {
      return { completed: false, isPerfect: false, score: 0, attempts: 0 };
    }
    
    const episodeData = progress.progressMap[episodeNum];
    return {
      completed: true,
      isPerfect: episodeData.isPerfect,
      score: episodeData.bestScore,
      attempts: episodeData.attempts,
    };
  };

  const getNextEpisode = (level: string) => {
    const progress = progressData[level];
    return progress ? progress.nextEpisode : 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading progress...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const operationInfo = {
    addition: { name: 'Addition', icon: '➕', color: 'from-green-500 to-emerald-500' },
    subtraction: { name: 'Subtraction', icon: '➖', color: 'from-red-500 to-rose-500' },
    multiplication: { name: 'Multiplication', icon: '✖️', color: 'from-blue-500 to-cyan-500' },
    division: { name: 'Division', icon: '➗', color: 'from-purple-500 to-violet-500' },
    mixed: { name: 'Mixed Operations', icon: '🎯', color: 'from-orange-500 to-amber-500' },
  }[operation] || { name: 'Unknown', icon: '❓', color: 'from-gray-500 to-gray-600' };

  const levels = [
    {
      name: 'Easy',
      description: '1-digit numbers (e.g., 7 + 8)',
      timeLimit: '1 minute',
      points: 1,
      episodes: 5,
      difficulty: 'Beginner',
    },
    {
      name: 'Medium',
      description: '2-digit numbers (e.g., 25 + 18)',
      timeLimit: '2 minutes',
      points: 2,
      episodes: 5,
      difficulty: 'Intermediate',
    },
    {
      name: 'Hard',
      description: '3-digit numbers (e.g., 107 + 185)',
      timeLimit: '3 minutes',
      points: 3,
      episodes: 5,
      difficulty: 'Advanced',
    },
    {
      name: 'Extreme',
      description: 'Mixed operations with parentheses',
      timeLimit: '4 minutes',
      points: 5,
      episodes: 3,
      difficulty: 'Expert',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Stars Background */}
      <div className="stars-container absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-300">
              ← Back to Dashboard
            </Link>
            <div className="text-2xl font-bold gradient-text">
              {operationInfo.icon} {operationInfo.name} Mission
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-white">
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-1">
              <span className="text-yellow-400 font-bold">{user.totalPoints} ⭐</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Operation Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{operationInfo.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {operationInfo.name} Mission
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your difficulty level and start your mathematical adventure. 
            Each level has multiple episodes to complete!
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {levels.map((level) => {
            const levelProgress = progressData[level.name.toLowerCase()];
            const nextEpisode = getNextEpisode(level.name.toLowerCase());
            const completedCount = levelProgress ? levelProgress.completedCount : 0;
            const perfectCount = levelProgress ? levelProgress.perfectCount : 0;
            const totalEpisodes = levelProgress ? levelProgress.totalEpisodes : level.episodes;
            
            return (
              <div key={level.name} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{level.name}</h2>
                  <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm text-gray-300 mb-4">
                    {level.difficulty}
                  </div>
                  <p className="text-gray-300 mb-4">{level.description}</p>
                  
                  {/* Progress Summary */}
                  <div className="bg-white/10 rounded-lg p-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Progress:</span>
                      <span className="text-white font-semibold">
                        {perfectCount}/{totalEpisodes} Perfect
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(perfectCount / totalEpisodes) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">⏱️ Time Limit:</span>
                    <span className="text-white font-semibold">{level.timeLimit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">⭐ Points per Question:</span>
                    <span className="text-yellow-400 font-semibold">{level.points} points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">📚 Episodes Available:</span>
                    <span className="text-white font-semibold">{totalEpisodes} episodes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🎯 Next Episode:</span>
                    <span className="text-blue-400 font-semibold">Episode {nextEpisode}</span>
                  </div>
                </div>

                {/* Episodes */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white mb-3">Episodes:</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: totalEpisodes }, (_, episodeIndex) => {
                      const episodeNum = episodeIndex + 1;
                      const status = getEpisodeStatus(level.name.toLowerCase(), episodeNum);
                      
                      return (
                        <Link
                          key={episodeNum}
                          href={`/quiz/${operation}/${level.name.toLowerCase()}/${episodeNum}`}
                        >
                          <div className={`relative rounded-lg p-3 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                            status.isPerfect 
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                              : status.completed 
                                ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white'
                                : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}>
                            <div className="font-bold text-lg">{episodeNum}</div>
                            {status.completed && (
                              <div className="text-xs mt-1">
                                {status.isPerfect ? '✨ Perfect!' : `${status.score}/10`}
                              </div>
                            )}
                            {status.attempts > 1 && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {status.attempts}
                              </div>
                            )}
                            {episodeNum === nextEpisode && !status.isPerfect && (
                              <div className="absolute -top-1 -left-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                ▶
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <Link href={`/quiz/${operation}/${level.name.toLowerCase()}/${nextEpisode}`}>
                    <button className={`w-full bg-gradient-to-r ${operationInfo.color} text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105`}>
                      {perfectCount === totalEpisodes 
                        ? `🎉 Replay ${level.name} Level` 
                        : `Continue ${level.name} - Episode ${nextEpisode}`
                      }
                    </button>
                  </Link>
                </div>
                
                {/* Level Statistics */}
                {completedCount > 0 && (
                  <div className="mt-4 bg-white/5 rounded-lg p-3">
                    <div className="text-sm text-gray-300 text-center">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="font-bold text-white">{completedCount}</div>
                          <div className="text-xs">Attempted</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-400">{perfectCount}</div>
                          <div className="text-xs">Perfect</div>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-400">
                            {levelProgress ? Math.round((perfectCount / totalEpisodes) * 100) : 0}%
                          </div>
                          <div className="text-xs">Complete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">🎯 Mission Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Speed Matters</h3>
              <p className="text-gray-300 text-sm">Answer quickly but accurately to maximize your score</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Accuracy Counts</h3>
              <p className="text-gray-300 text-sm">Each correct answer earns you valuable points</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📈</div>
              <h3 className="text-lg font-semibold text-white mb-2">Progressive Difficulty</h3>
              <p className="text-gray-300 text-sm">Episodes get progressively harder within each level</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
