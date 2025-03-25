import { D1Database } from '@cloudflare/workers-types';
import { getSession } from '@/lib/auth/auth-utils';

export async function GET(request: Request) {
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
    
    // Get user's connections
    let query;
    let params = [session.userId];
    
    if (session.role === 'teacher') {
      query = `
        SELECT 
          c.id, c.status, c.created_at, c.updated_at,
          u.id as user_id, u.first_name, u.last_name, u.email, u.photo_url,
          t.id as tech_id, t.name as tech_name, t.description as tech_description
        FROM connections c
        JOIN users u ON c.learner_id = u.id
        JOIN technologies t ON c.technology_id = t.id
        WHERE c.teacher_id = ?
        ORDER BY c.created_at DESC
      `;
    } else {
      query = `
        SELECT 
          c.id, c.status, c.created_at, c.updated_at,
          u.id as user_id, u.first_name, u.last_name, u.email, u.photo_url,
          t.id as tech_id, t.name as tech_name, t.description as tech_description
        FROM connections c
        JOIN users u ON c.teacher_id = u.id
        JOIN technologies t ON c.technology_id = t.id
        WHERE c.learner_id = ?
        ORDER BY c.created_at DESC
      `;
    }
    
    const results = await db.prepare(query).bind(...params).all();
    
    if (!results.success) {
      throw new Error('Failed to fetch connections');
    }
    
    return Response.json({
      connections: results.results
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return Response.json(
      { error: 'Failed to fetch connections' },
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
    const { connection_id, status } = await request.json();
    
    // Validate input
    if (!connection_id || !status) {
      return Response.json(
        { error: 'Connection ID and status are required' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Verify connection exists and user has permission to update it
    let query;
    let params = [connection_id];
    
    if (session.role === 'teacher') {
      query = 'SELECT id FROM connections WHERE id = ? AND teacher_id = ? LIMIT 1';
      params.push(session.userId);
    } else {
      query = 'SELECT id FROM connections WHERE id = ? AND learner_id = ? LIMIT 1';
      params.push(session.userId);
    }
    
    const connection = await db
      .prepare(query)
      .bind(...params)
      .first<{ id: number }>();
    
    if (!connection) {
      return Response.json(
        { error: 'Connection not found or you do not have permission to update it' },
        { status: 404 }
      );
    }
    
    // Update connection status
    const result = await db
      .prepare(`
        UPDATE connections
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        RETURNING *
      `)
      .bind(status, connection_id)
      .first();
    
    if (!result) {
      return Response.json(
        { error: 'Failed to update connection' },
        { status: 500 }
      );
    }
    
    return Response.json({
      success: true,
      connection: result
    });
  } catch (error) {
    console.error('Connection update error:', error);
    return Response.json(
      { error: 'Failed to update connection' },
      { status: 500 }
    );
  }
}
