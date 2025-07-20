# 🌌 MaQuizz - Space-Themed Math Quiz Website

Welcome to **MaQuizz**, an interactive NextJS-based mathematics quiz platform with a stunning space theme! Embark on a cosmic journey while mastering fundamental math operations across multiple difficulty levels.

![Space Theme](https://img.shields.io/badge/Theme-Space%20🚀-purple)
![NextJS](https://img.shields.io/badge/NextJS-15.3.4-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-cyan)

## 🚀 Features

### 🔐 User Authentication & Management
- **User Registration**: Secure signup with unique username validation
- **User Login**: Email/username and password authentication
- **Profile Management**: Edit personal information, view statistics, and track progress
- **JWT Authentication**: Secure session management with HTTP-only cookies

### 🧮 Math Quiz System
- **5 Mathematical Operations**:
  - ➕ Addition
  - ➖ Subtraction
  - ✖️ Multiplication
  - ➗ Division
  - 🎯 Mixed Operations (Ultimate Challenge)

### 📊 Difficulty Levels
- **Easy**: 1-digit numbers (1 point per question)
- **Medium**: 2-digit numbers (2 points per question)
- **Hard**: 3-digit numbers (3 points per question)
- **Extreme**: Complex mixed operations with parentheses (5 points per question)

### 🎮 Episode-Based Learning
- Multiple episodes per difficulty level
- Progressive difficulty within episodes
- 10 questions per episode
- Timed challenges with countdown timer

### 🏆 Leaderboard & Ranking System
- Global leaderboard showing top performers
- Real-time point tracking
- Rank visualization with special badges for top 3
- Personal progress tracking

### ⏱️ Dynamic Timer System
- **Easy**: 1 minute per episode
- **Medium**: 2 minutes per episode
- **Hard**: 3 minutes per episode
- **Extreme**: 4 minutes per episode

### 🌌 Space-Themed Design
- Animated starfield background
- Cosmic color schemes with gradients
- Space-related emojis and terminology
- Responsive design for all devices
- Smooth CSS animations
- Glassmorphism UI elements

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.4, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0, Custom CSS animations
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens, bcryptjs
- **Animations**: AnimateJS, CSS keyframes
- **Deployment Ready**: Vercel-optimized

## 📁 Project Structure

```
maquizz/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── leaderboard/route.ts
│   │   │   └── quiz/route.ts
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── quiz/
│   │   │   └── [operation]/
│   │   │       ├── page.tsx
│   │   │       └── [level]/
│   │   │           └── [episode]/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── mongodb.ts
│   │   └── utils.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── QuizEpisode.ts
│   └── middleware.ts
├── .env.local
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maquizz.git
   cd maquizz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

1. **Create Account**: Register with your name, username, email, and password
2. **Choose Operation**: Select from Addition, Subtraction, Multiplication, Division, or Mixed
3. **Pick Difficulty**: Choose Easy, Medium, Hard, or Extreme level
4. **Select Episode**: Start with Episode 1 and progress through the series
5. **Solve Problems**: Answer 10 math questions within the time limit
6. **Earn Points**: Accumulate points based on correct answers and difficulty
7. **Climb Leaderboard**: Compete with other space mathematicians globally!

## 🏆 Scoring System

| Level | Points per Correct Answer | Time Limit |
|-------|---------------------------|------------|
| Easy | 1 point | 1 minute |
| Medium | 2 points | 2 minutes |
| Hard | 3 points | 3 minutes |
| Extreme | 5 points | 4 minutes |

## 🌟 Key Features Highlights

- **Real-time Quiz Generation**: Dynamic math problems generated server-side
- **Progress Persistence**: User progress saved in MongoDB
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Security First**: Password hashing, JWT tokens, input validation
- **Performance Optimized**: Next.js 15 with Turbopack for fast development
- **Accessibility**: Proper semantic HTML and keyboard navigation

## 🔮 Future Enhancements

- [ ] Achievements and badge system
- [ ] Multiplayer quiz battles
- [ ] Daily challenges
- [ ] Advanced statistics and analytics
- [ ] Social features (friends, sharing scores)
- [ ] Mobile app version
- [ ] AI-powered adaptive difficulty
- [ ] Voice commands for answers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Space imagery inspiration from NASA
- Mathematical concepts from educational standards
- UI/UX design inspired by modern space exploration interfaces
- Community feedback and testing

## 📧 Contact

For questions, suggestions, or collaboration opportunities:

- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Project Link**: [https://github.com/yourusername/maquizz](https://github.com/yourusername/maquizz)

---

**Ready to launch your math skills into orbit? 🚀 Start your cosmic mathematical adventure today!**

*"Explore the Universe of Mathematics!"* - MaQuizz
