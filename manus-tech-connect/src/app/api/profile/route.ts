import { D1Database } from '@cloudflare/workers-types';
import { getSession } from '@/lib/auth/auth-utils';

export async function GET() {
  const session = getSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Get user profile
    const user = await db
      .prepare('SELECT * FROM users WHERE id = ? LIMIT 1')
      .bind(session.userId)
      .first();
    
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user technologies
    const technologies = await db
      .prepare(`
        SELECT t.id, t.name, t.description, ut.proficiency_level
        FROM technologies t
        LEFT JOIN user_technologies ut ON t.id = ut.technology_id AND ut.user_id = ?
      `)
      .bind(session.userId)
      .all();
    
    // Get user availability
    const availability = await db
      .prepare('SELECT * FROM user_availability WHERE user_id = ?')
      .bind(session.userId)
      .all();
    
    return Response.json({
      user,
      technologies: technologies.results,
      availability: availability.results
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return Response.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = getSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { first_name, last_name, photo_url } = await request.json();
    
    // Validate input
    if (!first_name || !last_name) {
      return Response.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Update user profile
    const result = await db
      .prepare(`
        UPDATE users
        SET first_name = ?, last_name = ?, photo_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        RETURNING *
      `)
      .bind(first_name, last_name, photo_url, session.userId)
      .first();
    
    if (!result) {
      return Response.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
    
    return Response.json({
      success: true,
      user: result
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return Response.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
