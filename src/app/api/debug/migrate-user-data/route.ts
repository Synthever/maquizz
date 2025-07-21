import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    console.log('Starting data migration for User.completedEpisodes...');
    await connectToDatabase();
    
    // Find users with completedEpisodes that might be missing bestScore or maxScore
    const users = await User.find({
      'completedEpisodes.0': { $exists: true }
    });

    console.log(`Found ${users.length} users with completed episodes`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      const updatedEpisodes = user.completedEpisodes.map((episode: {
        bestScore?: number;
        score?: number;
        maxScore?: number;
        attempts?: number;
        [key: string]: unknown;
      }) => {
        const updatedEpisode = { ...episode };
        
        // Add missing bestScore field
        if (!episode.bestScore && episode.score) {
          updatedEpisode.bestScore = episode.score;
          needsUpdate = true;
        }
        
        // Add missing maxScore field
        if (!episode.maxScore) {
          updatedEpisode.maxScore = 10;
          needsUpdate = true;
        }
        
        // Add missing attempts field
        if (!episode.attempts) {
          updatedEpisode.attempts = 1;
          needsUpdate = true;
        }
        
        return updatedEpisode;
      });
      
      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, {
          completedEpisodes: updatedEpisodes
        });
        updatedCount++;
        console.log(`Updated user ${user.username} (${user._id})`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Migration completed. Updated ${updatedCount} users.`,
      totalUsers: users.length,
      updatedUsers: updatedCount
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
