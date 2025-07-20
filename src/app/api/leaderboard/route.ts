import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get top 100 users by total points
    const leaderboard = await User.find({}, {
      password: 0, // Exclude password field
      email: 0    // Exclude email for privacy
    })
    .sort({ totalPoints: -1 })
    .limit(100)
    .lean();
    
    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    return NextResponse.json(rankedLeaderboard, { status: 200 });
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
