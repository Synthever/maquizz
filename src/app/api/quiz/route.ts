import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import QuizEpisode from '@/models/QuizEpisode';
import { generateQuizQuestions, getPointsForLevel, getTimeLimitForLevel } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const operation = searchParams.get('operation');
    const level = searchParams.get('level');
    const episode = searchParams.get('episode');
    
    if (!operation || !level || !episode) {
      return NextResponse.json(
        { error: 'Operation, level, and episode are required' },
        { status: 400 }
      );
    }
    
    // Check if episode exists in database
    let quizEpisode = await QuizEpisode.findOne({
      operation,
      level,
      episode: parseInt(episode)
    });
    
    // If episode doesn't exist, create it
    if (!quizEpisode) {
      const questions = generateQuizQuestions(operation, level, 10);
      const pointsPerQuestion = getPointsForLevel(level);
      const timeLimit = getTimeLimitForLevel(level);
      
      quizEpisode = new QuizEpisode({
        operation,
        level,
        episode: parseInt(episode),
        questions,
        timeLimit,
        pointsPerQuestion,
        isUnlocked: true, // For now, all episodes are unlocked
      });
      
      await quizEpisode.save();
    }
    
    return NextResponse.json(quizEpisode, { status: 200 });
    
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { operation, level, episode, score, userId } = await request.json();
    
    if (!operation || !level || !episode || score === undefined || !userId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Get the quiz episode to calculate points
    const quizEpisode = await QuizEpisode.findOne({
      operation,
      level,
      episode: parseInt(episode)
    });
    
    if (!quizEpisode) {
      return NextResponse.json(
        { error: 'Quiz episode not found' },
        { status: 404 }
      );
    }
    
    // Calculate total points earned
    const pointsEarned = score * quizEpisode.pointsPerQuestion;
    const isPerfect = score === 10;
    
    // Update user's progress and points
    const User = (await import('@/models/User')).default;
    
    // Check if user has already completed this episode
    const user = await User.findById(userId);
    const existingEpisode = user.completedEpisodes.find(
      (ep: { operation: string; level: string; episode: number }) => 
        ep.operation === operation && ep.level === level && ep.episode === parseInt(episode)
    );
    
    if (existingEpisode) {
      // Update existing episode if new score is better
      if (score > existingEpisode.bestScore) {
        const pointsDifference = (score - existingEpisode.bestScore) * quizEpisode.pointsPerQuestion;
        
        await User.findByIdAndUpdate(userId, {
          $set: {
            'completedEpisodes.$.score': score,
            'completedEpisodes.$.bestScore': score,
            'completedEpisodes.$.isPerfect': isPerfect,
            'completedEpisodes.$.timeCompleted': new Date(),
            'completedEpisodes.$.attempts': (existingEpisode.attempts || 0) + 1,
          },
          $inc: {
            totalPoints: pointsDifference
          }
        });
        
        return NextResponse.json(
          { 
            message: 'Quiz completed successfully - New best score!',
            pointsEarned: pointsDifference,
            totalScore: score,
            isPerfect,
            isNewBest: true,
            attempts: (existingEpisode.attempts || 0) + 1
          },
          { status: 200 }
        );
      } else {
        // Just update attempts, no points change
        await User.findByIdAndUpdate(userId, {
          $set: {
            'completedEpisodes.$.attempts': (existingEpisode.attempts || 0) + 1
          }
        });
        
        return NextResponse.json(
          { 
            message: 'Quiz completed successfully',
            pointsEarned: 0,
            totalScore: score,
            isPerfect,
            isNewBest: false,
            attempts: (existingEpisode.attempts || 0) + 1,
            bestScore: existingEpisode.bestScore
          },
          { status: 200 }
        );
      }
    } else {
      // Add new episode completion
      await User.findByIdAndUpdate(userId, {
        $push: {
          completedEpisodes: {
            operation,
            level,
            episode: parseInt(episode),
            score,
            maxScore: 10,
            isPerfect,
            attempts: 1,
            bestScore: score,
            timeCompleted: new Date(),
          }
        },
        $inc: {
          totalPoints: pointsEarned
        }
      });
      
      return NextResponse.json(
        { 
          message: 'Quiz completed successfully',
          pointsEarned,
          totalScore: score,
          isPerfect,
          isNewBest: true,
          attempts: 1
        },
        { status: 200 }
      );
    }
    
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
