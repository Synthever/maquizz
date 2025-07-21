import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('Testing User model...');
    await connectToDatabase();
    
    // Test if User model is working
    const userCount = await User.countDocuments();
    console.log('User count:', userCount);
    
    // Try to find test user
    const testUser = await User.findOne({ email: 'test@test.com' });
    console.log('Test user exists:', !!testUser);
    
    return NextResponse.json({
      success: true,
      userCount,
      testUserExists: !!testUser,
      testUserData: testUser ? {
        id: testUser._id,
        email: testUser.email,
        username: testUser.username,
        name: testUser.name
      } : null
    });
    
  } catch (error) {
    console.error('User model test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
