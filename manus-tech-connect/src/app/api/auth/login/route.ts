import { D1Database } from '@cloudflare/workers-types';
import { verifyPassword, createSession } from '@/lib/auth/auth-utils';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Validate input
  if (!email || !password) {
    return Response.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }
  
  try {
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Verify credentials
    const user = await verifyPassword(db, email, password);
    
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create session
    const sessionToken = createSession(user);
    
    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        photoUrl: user.photo_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
