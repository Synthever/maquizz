import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    console.log('Starting comprehensive data migration for User.completedEpisodes...');
    await connectToDatabase();
    
    // Find users with completedEpisodes that might be missing bestScore or maxScore
    const users = await User.find({
      'completedEpisodes.0': { $exists: true }
    });

    console.log(`Found ${users.length} users with completed episodes`);
    
    let updatedCount = 0;
    let totalIssuesFixed = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      
      // Remove duplicates and keep only the best score for each episode
      const episodeMap = new Map();
      user.completedEpisodes.forEach((episode: {
        operation: string;
        level: string;
        episode: number;
        score?: number;
        bestScore?: number;
        [key: string]: unknown;
      }) => {
        const key = `${episode.operation}-${episode.level}-${episode.episode}`;
        const currentScore = episode.bestScore || episode.score || 0;
        
        if (!episodeMap.has(key) || episodeMap.get(key).score < currentScore) {
          episodeMap.set(key, { ...episode, score: currentScore });
        }
      });
      
      const uniqueEpisodes = Array.from(episodeMap.values());
      
      if (uniqueEpisodes.length !== user.completedEpisodes.length) {
        console.log(`Removed ${user.completedEpisodes.length - uniqueEpisodes.length} duplicate episodes for user ${user.username}`);
        needsUpdate = true;
        totalIssuesFixed += user.completedEpisodes.length - uniqueEpisodes.length;
      }
      
      const updatedEpisodes = uniqueEpisodes.map((episode: {
        bestScore?: number;
        score?: number;
        maxScore?: number;
        attempts?: number;
        isPerfect?: boolean;
        [key: string]: unknown;
      }) => {
        const updatedEpisode = { ...episode };
        
        // Fix missing or incorrect bestScore field
        if (!episode.bestScore || episode.bestScore < episode.score!) {
          updatedEpisode.bestScore = episode.score || 0;
          needsUpdate = true;
          totalIssuesFixed++;
          console.log(`Fixed bestScore for episode: ${episode.score} -> ${updatedEpisode.bestScore}`);
        }
        
        // Fix isPerfect field based on score
        const currentScore = episode.bestScore || episode.score || 0;
        const shouldBePerfect = currentScore === 10;
        if (episode.isPerfect !== shouldBePerfect) {
          updatedEpisode.isPerfect = shouldBePerfect;
          needsUpdate = true;
          totalIssuesFixed++;
          console.log(`Fixed isPerfect for episode: score=${currentScore}, isPerfect=${shouldBePerfect}`);
        }
        
        // Add missing maxScore field
        if (!episode.maxScore) {
          updatedEpisode.maxScore = 10;
          needsUpdate = true;
          totalIssuesFixed++;
        }
        
        // Add missing attempts field
        if (!episode.attempts) {
          updatedEpisode.attempts = 1;
          needsUpdate = true;
          totalIssuesFixed++;
        }
        
        // Ensure score exists
        if (!episode.score && episode.score !== 0) {
          updatedEpisode.score = 0;
          needsUpdate = true;
          totalIssuesFixed++;
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
      message: `Comprehensive migration completed. Updated ${updatedCount} users with ${totalIssuesFixed} issues fixed.`,
      totalUsers: users.length,
      updatedUsers: updatedCount,
      issuesFixed: totalIssuesFixed
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
