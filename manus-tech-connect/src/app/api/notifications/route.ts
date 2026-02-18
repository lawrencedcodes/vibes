export const runtime = "edge";
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
    
    // Get user's notifications
    const query = `
      SELECT 
        n.id, n.type, n.content, n.is_read, n.created_at,
        c.id as connection_id, c.status as connection_status,
        u.id as user_id, u.first_name, u.last_name, u.photo_url,
        t.id as technology_id, t.name as technology_name
      FROM notifications n
      LEFT JOIN connections c ON n.connection_id = c.id
      LEFT JOIN users u ON (
        (n.type = 'connection_request' AND c.teacher_id = u.id AND n.user_id = c.learner_id) OR
        (n.type = 'connection_request' AND c.learner_id = u.id AND n.user_id = c.teacher_id) OR
        (n.type IN ('connection_accepted', 'connection_rejected', 'message_received') AND n.sender_id = u.id)
      )
      LEFT JOIN technologies t ON c.technology_id = t.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `;
    
    const results = await db.prepare(query).bind(session.userId).all();
    
    if (!results.success) {
      throw new Error('Failed to fetch notifications');
    }
    
    return Response.json({
      notifications: results.results
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return Response.json(
      { error: 'Failed to fetch notifications' },
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
    const { notification_id } = (((await request.json()) as any) as any) as any;
    
    if (!notification_id) {
      return Response.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Mark notification as read
    const result = await db
      .prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?')
      .bind(notification_id, session.userId)
      .run();
    
    if (!result.success) {
      throw new Error('Failed to mark notification as read');
    }
    
    return Response.json({
      success: true
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return Response.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
