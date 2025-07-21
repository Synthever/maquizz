import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    console.log('Starting final data fix for episode scores...');
    await connectToDatabase();
    
    const users = await User.find({
      'completedEpisodes.0': { $exists: true }
    });

    console.log(`Found ${users.length} users with completed episodes`);
    
    let updatedCount = 0;
    let totalIssuesFixed = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      
      const updatedEpisodes = user.completedEpisodes.map((episode: {
        operation?: string;
        level?: string;
        episode?: number;
        score?: number;
        bestScore?: number;
        isPerfect?: boolean;
        maxScore?: number;
        attempts?: number;
        [key: string]: unknown;
      }) => {
        const updatedEpisode = { ...episode };
        
        // Ensure all required fields exist
        const currentScore = episode.score || 0;
        const currentBestScore = episode.bestScore || currentScore;
        const finalBestScore = Math.max(currentScore, currentBestScore);
        
        // Update bestScore to be the maximum
        if (episode.bestScore !== finalBestScore) {
          updatedEpisode.bestScore = finalBestScore;
          needsUpdate = true;
          totalIssuesFixed++;
          console.log(`Fixed bestScore: ${episode.bestScore} -> ${finalBestScore} for episode ${episode.operation}-${episode.level}-${episode.episode}`);
        }
        
        // Update isPerfect based on bestScore (not current score)
        const shouldBePerfect = finalBestScore === 10;
        if (episode.isPerfect !== shouldBePerfect) {
          updatedEpisode.isPerfect = shouldBePerfect;
          needsUpdate = true;
          totalIssuesFixed++;
          console.log(`Fixed isPerfect: ${episode.isPerfect} -> ${shouldBePerfect} for episode ${episode.operation}-${episode.level}-${episode.episode}`);
        }
        
        // Ensure other fields
        if (!episode.maxScore) {
          updatedEpisode.maxScore = 10;
          needsUpdate = true;
          totalIssuesFixed++;
        }
        
        if (!episode.attempts) {
          updatedEpisode.attempts = 1;
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
      message: `Final episode score fix completed. Updated ${updatedCount} users with ${totalIssuesFixed} issues fixed.`,
      totalUsers: users.length,
      updatedUsers: updatedCount,
      issuesFixed: totalIssuesFixed
    });
    
  } catch (error) {
    console.error('Final fix error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
