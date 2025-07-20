'use client';

import { useState } from 'react';

export default function TestLogin() {
  const [emailOrUsername, setEmailOrUsername] = useState('test@test.com');
  const [password, setPassword] = useState('123456');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('Testing login...');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Login Successful! User: ${data.user.name}, Email: ${data.user.email}, Points: ${data.user.totalPoints}`);
        
        // Store in localStorage like the real app
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
      } else {
        setResult(`❌ Error: ${data.error}`);
      }

    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">🚀 Test Login</h1>
        
        <div className="bg-blue-500/20 rounded-lg p-4 mb-6 text-white">
          <h3 className="font-bold mb-2">Test Credentials:</h3>
          <p>Email: test@test.com</p>
          <p>Username: testuser</p>
          <p>Password: 123456</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Email or Username"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300"
            required
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </form>
        
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-white/10 text-white">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
