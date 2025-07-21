import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return raw episode data for debugging
    return NextResponse.json({
      success: true,
      userId: user._id,
      username: user.username,
      totalEpisodes: user.completedEpisodes.length,
      episodes: user.completedEpisodes.map((ep: {
        operation: string;
        level: string;
        episode: number;
        score: number;
        bestScore: number;
        maxScore: number;
        isPerfect: boolean;
        attempts: number;
        timeCompleted: Date;
      }) => ({
        operation: ep.operation,
        level: ep.level,
        episode: ep.episode,
        score: ep.score,
        bestScore: ep.bestScore,
        maxScore: ep.maxScore,
        isPerfect: ep.isPerfect,
        attempts: ep.attempts,
        timeCompleted: ep.timeCompleted
      }))
    });
    
  } catch (error) {
    console.error('Debug episodes error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
