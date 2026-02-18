export const runtime = "edge";
import { D1Database } from '@cloudflare/workers-types';
import { registerUser, createSession } from '@/lib/auth/auth-utils';

export async function POST(request: Request) {
  const { email, password, first_name, last_name, role } = (((await request.json()) as any) as any) as any;
  
  // Validate input
  if (!email || !password || !first_name || !last_name || !role) {
    return Response.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }
  
  // Validate role
  if (role !== 'teacher' && role !== 'learner') {
    return Response.json(
      { error: 'Role must be either teacher or learner' },
      { status: 400 }
    );
  }
  
  try {
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Register user
    const user = await registerUser(db, {
      email,
      password,
      first_name,
      last_name,
      role
    });
    
    if (!user) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
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
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
