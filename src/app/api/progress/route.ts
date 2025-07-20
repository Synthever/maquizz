import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

interface EpisodeProgress {
  operation: string;
  level: string;
  episode: number;
  score: number;
  maxScore: number;
  isPerfect: boolean;
  attempts: number;
  bestScore: number;
  timeCompleted: Date;
}

interface ProgressMap {
  [key: number]: {
    score: number;
    maxScore: number;
    isPerfect: boolean;
    attempts: number;
    bestScore: number;
    timeCompleted: Date;
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const operation = searchParams.get('operation');
    const level = searchParams.get('level');
    
    if (!userId || !operation || !level) {
      return NextResponse.json(
        { error: 'userId, operation, and level are required' },
        { status: 400 }
      );
    }
    
    // Get user's progress for specific operation and level
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Filter completed episodes for this operation and level
    const episodesProgress = user.completedEpisodes.filter(
      (ep: EpisodeProgress) => ep.operation === operation && ep.level === level
    );
    
    // Create progress map
    const progressMap: ProgressMap = {};
    episodesProgress.forEach((ep: EpisodeProgress) => {
      progressMap[ep.episode] = {
        score: ep.score,
        maxScore: ep.maxScore,
        bestScore: ep.bestScore,
        isPerfect: ep.isPerfect,
        attempts: ep.attempts,
        timeCompleted: ep.timeCompleted,
      };
    });
    
    // Find next incomplete episode
    const totalEpisodes = level === 'extreme' ? 3 : 5;
    let nextEpisode = 1;
    
    for (let i = 1; i <= totalEpisodes; i++) {
      if (!progressMap[i] || !progressMap[i].isPerfect) {
        nextEpisode = i;
        break;
      }
      if (i === totalEpisodes && progressMap[i] && progressMap[i].isPerfect) {
        nextEpisode = totalEpisodes; // All completed, set to last episode
      }
    }
    
    return NextResponse.json({
      progressMap,
      nextEpisode,
      totalEpisodes,
      completedCount: Object.keys(progressMap).length,
      perfectCount: Object.values(progressMap).filter((p) => p.isPerfect).length,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
