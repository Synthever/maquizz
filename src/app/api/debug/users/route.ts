import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('Getting all users...');
    
    await connectToDatabase();
    console.log('Database connected successfully');
    
    // Get all users (without passwords)
    const users = await User.find({}, { password: 0 }).lean();
    console.log('Users found:', users.length);
    
    return NextResponse.json({
      success: true,
      count: users.length,
      users: users
    });
    
  } catch (error) {
    console.error('Error getting users:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
