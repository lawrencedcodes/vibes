export const runtime = "edge";
import { D1Database } from '@cloudflare/workers-types';
import { getSession } from '@/lib/auth/auth-utils';

export async function POST(request: Request) {
  const session = getSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { technology_id, proficiency_level } = (((await request.json()) as any) as any) as any;
    
    // Validate input
    if (!technology_id || !proficiency_level) {
      return Response.json(
        { error: 'Technology ID and proficiency level are required' },
        { status: 400 }
      );
    }
    
    // Validate proficiency level
    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!validLevels.includes(proficiency_level)) {
      return Response.json(
        { error: 'Invalid proficiency level' },
        { status: 400 }
      );
    }
    
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Check if technology exists
    const technology = await db
      .prepare('SELECT id FROM technologies WHERE id = ? LIMIT 1')
      .bind(technology_id)
      .first<{ id: number }>();
    
    if (!technology) {
      return Response.json(
        { error: 'Technology not found' },
        { status: 404 }
      );
    }
    
    // Check if user already has this technology
    const existingTech = await db
      .prepare('SELECT id FROM user_technologies WHERE user_id = ? AND technology_id = ? LIMIT 1')
      .bind(session.userId, technology_id)
      .first<{ id: number }>();
    
    let result;
    
    if (existingTech) {
      // Update existing technology
      result = await db
        .prepare(`
          UPDATE user_technologies
          SET proficiency_level = ?
          WHERE user_id = ? AND technology_id = ?
          RETURNING *
        `)
        .bind(proficiency_level, session.userId, technology_id)
        .first();
    } else {
      // Add new technology
      result = await db
        .prepare(`
          INSERT INTO user_technologies (user_id, technology_id, proficiency_level)
          VALUES (?, ?, ?)
          RETURNING *
        `)
        .bind(session.userId, technology_id, proficiency_level)
        .first();
    }
    
    if (!result) {
      return Response.json(
        { error: 'Failed to update technology' },
        { status: 500 }
      );
    }
    
    return Response.json({
      success: true,
      technology: result
    });
  } catch (error) {
    console.error('Technology update error:', error);
    return Response.json(
      { error: 'Failed to update technology' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = getSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const url = new URL(request.url);
  const technology_id = url.searchParams.get('technology_id');
  
  if (!technology_id) {
    return Response.json(
      { error: 'Technology ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Delete technology from user
    const result = await db
      .prepare('DELETE FROM user_technologies WHERE user_id = ? AND technology_id = ?')
      .bind(session.userId, technology_id)
      .run();
    
    if (!result.success) {
      return Response.json(
        { error: 'Failed to remove technology' },
        { status: 500 }
      );
    }
    
    return Response.json({
      success: true
    });
  } catch (error) {
    console.error('Technology removal error:', error);
    return Response.json(
      { error: 'Failed to remove technology' },
      { status: 500 }
    );
  }
}
