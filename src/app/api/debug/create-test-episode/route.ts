import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { userId, operation, level, episode, score } = await request.json();
    
    if (!userId || !operation || !level || !episode || score === undefined) {
      return NextResponse.json(
        { error: 'userId, operation, level, episode, and score are required' },
        { status: 400 }
      );
    }
    
    const isPerfect = score === 10;
    
    // Add or update episode completion
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
        totalPoints: score * (level === 'easy' ? 1 : level === 'medium' ? 2 : level === 'hard' ? 3 : 5)
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test episode created successfully',
      episode: {
        operation,
        level,
        episode,
        score,
        isPerfect
      }
    });
    
  } catch (error) {
    console.error('Create test episode error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
