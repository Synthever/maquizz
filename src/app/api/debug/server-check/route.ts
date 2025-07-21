import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const checks: {
      timestamp: string;
      environment: string | undefined;
      hasMongoUri: boolean;
      hasJwtSecret: boolean;
      mongoUriPreview: string;
      databaseConnection?: string;
      databaseError?: string;
    } = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      mongoUriPreview: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.substring(0, 20) + '...' : 'Not set',
    };

    // Test database connection
    try {
      await connectToDatabase();
      checks.databaseConnection = 'SUCCESS';
    } catch (dbError) {
      checks.databaseConnection = 'FAILED';
      checks.databaseError = dbError instanceof Error ? dbError.message : 'Unknown database error';
    }

    return NextResponse.json({
      success: true,
      checks
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
