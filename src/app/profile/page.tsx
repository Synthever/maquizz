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
    createdAt: string;
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
    });
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
            setFormData({
                name: parsedUser.name,
                username: parsedUser.username,
                email: parsedUser.email,
            });
        } catch {
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
            });
        }
        setEditing(false);
    };

    const handleSave = () => {
        // Here you would typically make an API call to update the user
        // For now, we'll just update localStorage
        if (user) {
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
        setEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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

    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

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
                            👤 Space Explorer Profile
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-white/10 rounded-lg px-3 py-1">
                            <span className="text-yellow-400 font-bold">{user.totalPoints} ⭐</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🧑‍🚀</div>
                                <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                                <p className="text-gray-300 mb-4">@{user.username}</p>
                                <div className="bg-white/10 rounded-lg p-3 mb-4">
                                    <div className="text-yellow-400 font-bold text-2xl">{user.totalPoints}</div>
                                    <div className="text-gray-300 text-sm">Total Points</div>
                                </div>
                                <div className="text-gray-400 text-sm">
                                    Space Explorer since {memberSince}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                                {!editing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="space-x-2">
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-500/20 hover:bg-green-500/30 text-green-200 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Full Name
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-white/5 rounded-lg text-white">{user.name}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Username
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-white/5 rounded-lg text-white">@{user.username}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Email
                                    </label>
                                    {editing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-white/5 rounded-lg text-white">{user.email}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-6">Mission Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{user.totalPoints}</div>
                                    <div className="text-gray-300 text-sm">Total Points</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{user.completedEpisodes.length}</div>
                                    <div className="text-gray-300 text-sm">Episodes Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {user.completedEpisodes.length > 0
                                            ? Math.round((user.completedEpisodes.reduce((sum, ep) => sum + ep.score, 0) /
                                                (user.completedEpisodes.length * 10)) * 100)
                                            : 0}%
                                    </div>
                                    <div className="text-gray-300 text-sm">Average Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-6">Recent Missions</h3>
                            {user.completedEpisodes.length > 0 ? (
                                <div className="space-y-3">
                                    {user.completedEpisodes.slice(-5).reverse().map((episode, index) => (
                                        <div key={index} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                                            <div>
                                                <div className="text-white font-semibold">
                                                    {episode.operation.charAt(0).toUpperCase() + episode.operation.slice(1)} - {episode.level.charAt(0).toUpperCase() + episode.level.slice(1)}
                                                </div>
                                                <div className="text-gray-300 text-sm">Episode {episode.episode}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-bold">{episode.score || 0}/10</div>
                                                <div className="text-yellow-400 text-sm">+{(episode.score || 0) * (episode.level === 'easy' ? 1 : episode.level === 'medium' ? 2 : episode.level === 'hard' ? 3 : 5)} pts</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-300 py-8">
                                    <div className="text-4xl mb-4">🚀</div>
                                    <p>No missions completed yet!</p>
                                    <p className="text-sm">Start your space adventure now!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
