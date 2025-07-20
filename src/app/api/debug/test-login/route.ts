import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test login with the test user credentials
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrUsername: 'test@test.com',
        password: '123456'
      }),
    });

    const data = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: data,
      testCredentials: {
        email: 'test@test.com',
        password: '123456'
      }
    });
    
  } catch (error) {
    console.error('Test login error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
