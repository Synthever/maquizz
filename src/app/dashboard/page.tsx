'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    } catch {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const operations = [
    {
      name: 'Addition',
      icon: '➕',
      description: 'Master the art of adding numbers',
      color: 'from-green-500 to-emerald-500',
      route: '/quiz/addition',
    },
    {
      name: 'Subtraction',
      icon: '➖',
      description: 'Perfect your subtraction skills',
      color: 'from-red-500 to-rose-500',
      route: '/quiz/subtraction',
    },
    {
      name: 'Multiplication',
      icon: '✖️',
      description: 'Multiply your way to success',
      color: 'from-blue-500 to-cyan-500',
      route: '/quiz/multiplication',
    },
    {
      name: 'Division',
      icon: '➗',
      description: 'Divide and conquer',
      color: 'from-purple-500 to-violet-500',
      route: '/quiz/division',
    },
    {
      name: 'Mixed Operations',
      icon: '🎯',
      description: 'Ultimate challenge with all operations',
      color: 'from-orange-500 to-amber-500',
      route: '/quiz/mixed',
    },
  ];

  const levels = [
    { name: 'Easy', description: '1-digit numbers', points: '1 pt per question' },
    { name: 'Medium', description: '2-digit numbers', points: '2 pts per question' },
    { name: 'Hard', description: '3-digit numbers', points: '3 pts per question' },
    { name: 'Extreme', description: 'Mixed operations', points: '5 pts per question' },
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
            <Link href="/" className="text-2xl font-bold gradient-text">
              🌌 MaQuizz
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-white">
              <span className="text-sm text-gray-300">Welcome back,</span>
              <span className="font-semibold ml-1">{user.name}</span>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-1">
              <span className="text-yellow-400 font-bold">{user.totalPoints} ⭐</span>
            </div>
            <Link href="/leaderboard" className="text-purple-400 hover:text-purple-300">
              🏆 Leaderboard
            </Link>
            <Link href="/profile" className="text-blue-400 hover:text-blue-300">
              👤 Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🚀 Mission Control Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your mathematical mission and explore the universe of numbers. 
            Each operation will take you on a different cosmic adventure!
          </p>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {operations.map((operation) => (
            <Link key={operation.name} href={operation.route}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="text-center">
                  <div className="text-4xl mb-4">{operation.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{operation.name}</h3>
                  <p className="text-gray-300 mb-4">{operation.description}</p>
                  <div className={`bg-gradient-to-r ${operation.color} text-white font-bold py-2 px-4 rounded-lg inline-block`}>
                    Start Mission
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Difficulty Levels Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎯 Difficulty Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {levels.map((level) => (
              <div key={level.name} className="text-center">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">{level.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{level.description}</p>
                  <div className="text-yellow-400 font-semibold">{level.points}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white">{user.totalPoints}</div>
            <div className="text-gray-300">Total Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-white">{user.completedEpisodes.length}</div>
            <div className="text-gray-300">Episodes Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">Coming Soon</div>
            <div className="text-gray-300">Your Rank</div>
          </div>
        </div>
      </main>
    </div>
  );
}
