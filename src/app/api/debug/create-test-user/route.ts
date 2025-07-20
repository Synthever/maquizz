import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/utils';

export async function GET() {
  try {
    console.log('Creating test user...');
    await connectToDatabase();
    
    // Create test user
    const hashedPassword = await hashPassword('123456');
    
    const testUser = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'test@test.com',
      password: hashedPassword,
      totalPoints: 0,
      completedEpisodes: []
    });
    
    await testUser.save();
    console.log('Test user created successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Test user created',
      credentials: {
        email: 'test@test.com',
        username: 'testuser',
        password: '123456'
      }
    });
    
  } catch (error) {
    console.error('Error creating test user:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
