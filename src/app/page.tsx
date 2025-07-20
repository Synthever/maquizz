'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const starsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create animated stars
    const createStars = () => {
      if (!starsRef.current) return;
      
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsRef.current.appendChild(star);
      }
    };

    createStars();

    // Simple CSS animations for now (anime.js will be added later)
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.transform = 'translateY(0)';
      }
    }, 100);

    setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = '1';
        subtitleRef.current.style.transform = 'translateY(0)';
      }
    }, 500);

    setTimeout(() => {
      if (ctaRef.current) {
        ctaRef.current.style.opacity = '1';
        ctaRef.current.style.transform = 'translateY(0)';
      }
    }, 900);

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Stars Background */}
      <div ref={starsRef} className="stars-container absolute inset-0"></div>
      
      {/* Nebula Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-transparent to-blue-800/20"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center pt-16 pb-8">
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white mb-8 mt-8 opacity-0 gradient-text"
        >
          Explore the Universe of Mathematics!
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl leading-relaxed opacity-0"
        >
          Welcome to the most thrilling math quiz website! Embark on a space journey while 
          mastering the fundamentals of math. From simple addition to mind-boggling equations 
          in the Extreme mode, challenge yourself across multiple levels and episodes. 
          Solve questions, rack up points, and race to the top of the leaderboard. 
          Are you ready to launch your math skills into orbit?
        </p>
        
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 mb-12 opacity-0">
          <Link href="/auth/register">
            <button className="cta-button bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              🚀 Sign Up Now and Start Your Journey!
            </button>
          </Link>
          
          <Link href="/auth/login">
            <button className="cta-button bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              ⭐ Already have an account? Login Here
            </button>
          </Link>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl mb-3">🧮</div>
            <h3 className="text-xl font-bold text-white mb-2">Math Challenges for All Skill Levels</h3>
            <p className="text-gray-300">From easy 1-digit problems to extreme mixed operations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">Compete on a Global Leaderboard</h3>
            <p className="text-gray-300">See how you stack up against other space mathematicians</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl mb-3">💫</div>
            <h3 className="text-xl font-bold text-white mb-2">Earn Points and Unlock New Episodes</h3>
            <p className="text-gray-300">Progress through challenging episodes and earn cosmic rewards</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl mb-3">🌌</div>
            <h3 className="text-xl font-bold text-white mb-2">Space-Themed Design with Stunning Animations</h3>
            <p className="text-gray-300">Beautiful cosmic visuals powered by anime.js</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Track Your Progress and Achievements</h3>
            <p className="text-gray-300">Monitor your improvement across different math operations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Timed Challenges</h3>
            <p className="text-gray-300">Race against the clock in exciting math adventures</p>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-gray-400 text-center mt-8 mb-8 pt-8">
          <p className="mb-3">Powered by NextJS | Space Themed | Anime.js Animations</p>
          <div className="flex gap-4 justify-center">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
