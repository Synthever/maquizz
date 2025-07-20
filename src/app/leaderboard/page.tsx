'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardUser {
    _id: string;
    name: string;
    username: string;
    totalPoints: number;
    rank: number;
}

interface User {
    _id: string;
    name: string;
    username: string;
    totalPoints: number;
}

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setCurrentUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }

        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard');
            const data = await response.json();

            if (response.ok) {
                setLeaderboard(data);
            } else {
                console.error('Failed to fetch leaderboard:', data.error);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-400'; // Gold
        if (rank === 2) return 'text-gray-300'; // Silver
        if (rank === 3) return 'text-amber-600'; // Bronze
        return 'text-white';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '👑';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '🌟';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading leaderboard...</div>
            </div>
        );
    }

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
                            🏆 Cosmic Leaderboard
                        </div>
                    </div>
                    {currentUser && (
                        <div className="flex items-center space-x-6">
                            <div className="text-white">
                                <span className="font-semibold">{currentUser.name}</span>
                            </div>
                            <div className="bg-white/10 rounded-lg px-3 py-1">
                                <span className="text-yellow-400 font-bold">{currentUser.totalPoints} ⭐</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        🌌 Top Space Mathematicians
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        See how you rank among the galaxy&apos;s greatest math explorers.
                        Climb the leaderboard by earning points in quiz missions!
                    </p>
                </div>

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <div className="flex justify-center items-end mb-12 space-x-4">
                        {/* Second Place */}
                        <div className="text-center">
                            <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg p-6 mb-4 transform translate-y-8">
                                <div className="text-3xl mb-2">🥈</div>
                                <div className="text-white font-bold text-lg">{leaderboard[1].name}</div>
                                <div className="text-gray-300">@{leaderboard[1].username}</div>
                                <div className="text-yellow-400 font-bold text-xl mt-2">{leaderboard[1].totalPoints} ⭐</div>
                            </div>
                            <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">
                                #2
                            </div>
                        </div>

                        {/* First Place */}
                        <div className="text-center">
                            <div className="bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-lg p-8 mb-4">
                                <div className="text-4xl mb-2">👑</div>
                                <div className="text-white font-bold text-xl">{leaderboard[0].name}</div>
                                <div className="text-yellow-100">@{leaderboard[0].username}</div>
                                <div className="text-white font-bold text-2xl mt-2">{leaderboard[0].totalPoints} ⭐</div>
                            </div>
                            <div className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg">
                                #1 CHAMPION
                            </div>
                        </div>

                        {/* Third Place */}
                        <div className="text-center">
                            <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg p-6 mb-4 transform translate-y-8">
                                <div className="text-3xl mb-2">🥉</div>
                                <div className="text-white font-bold text-lg">{leaderboard[2].name}</div>
                                <div className="text-amber-200">@{leaderboard[2].username}</div>
                                <div className="text-yellow-400 font-bold text-xl mt-2">{leaderboard[2].totalPoints} ⭐</div>
                            </div>
                            <div className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg">
                                #3
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Leaderboard */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                    <div className="p-6 bg-white/5 border-b border-white/20">
                        <h2 className="text-2xl font-bold text-white text-center">🌟 Complete Rankings</h2>
                    </div>

                    <div className="divide-y divide-white/10">
                        {leaderboard.map((user) => (
                            <div
                                key={user._id}
                                className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors ${currentUser && user._id === currentUser._id ? 'bg-purple-500/20 border-l-4 border-purple-500' : ''
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`text-2xl font-bold w-12 text-center ${getRankColor(user.rank)}`}>
                                        {user.rank <= 3 ? getRankIcon(user.rank) : `#${user.rank}`}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg">{user.name}</div>
                                        <div className="text-gray-300">@{user.username}</div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-yellow-400 font-bold text-xl">{user.totalPoints}</div>
                                    <div className="text-gray-300 text-sm">points</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Your Rank Section */}
                {currentUser && (
                    <div className="mt-8 bg-purple-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/50">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">🚀 Your Cosmic Standing</h3>
                        <div className="text-center">
                            {(() => {
                                const userRank = leaderboard.find(u => u._id === currentUser._id);
                                const rank = userRank?.rank || 0;
                                return (
                                    <>
                                        <div className="text-3xl mb-2">
                                            {rank <= 3 && rank > 0
                                                ? getRankIcon(rank)
                                                : '🌟'
                                            }
                                        </div>
                                        <div className="text-white font-bold text-xl">
                                            Rank #{rank > 0 ? rank : 'Unranked'}
                                        </div>
                                        <div className="text-yellow-400 font-bold text-lg">{currentUser.totalPoints} points</div>
                                        <div className="text-gray-300 mt-2">
                                            Keep solving math problems to climb higher!
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <Link href="/dashboard">
                        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                            🚀 Start New Mission
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
