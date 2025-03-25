import { D1Database } from '@cloudflare/workers-types';
import { getSession } from '@/lib/auth/auth-utils';
import { createMessageReceivedNotification } from '@/lib/notifications';

export async function GET(
  request: Request,
  { params }: { params: { connectionId: string } }
) {
  const session = getSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const connectionId = params.connectionId;
  
  if (!connectionId) {
    return Response.json(
      { error: 'Connection ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Verify connection exists and user is part of it
    const connection = await db
      .prepare(`
        SELECT * FROM connections
        WHERE id = ? AND (teacher_id = ? OR learner_id = ?)
        LIMIT 1
      `)
      .bind(connectionId, session.userId, session.userId)
      .first();
    
    if (!connection) {
      return Response.json(
        { error: 'Connection not found or you do not have access to it' },
        { status: 404 }
      );
    }
    
    // Get messages for this connection
    const messages = await db
      .prepare(`
        SELECT 
          m.id, m.sender_id, m.content, m.read, m.created_at,
          u.first_name, u.last_name, u.photo_url
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.connection_id = ?
        ORDER BY m.created_at ASC
      `)
      .bind(connectionId)
      .all();
    
    if (!messages.success) {
      throw new Error('Failed to fetch messages');
    }
    
    // Get other user's info
    const otherUserId = (connection as any).teacher_id === session.userId 
      ? (connection as any).learner_id 
      : (connection as any).teacher_id;
    
    const otherUser = await db
      .prepare('SELECT id, first_name, last_name, photo_url FROM users WHERE id = ? LIMIT 1')
      .bind(otherUserId)
      .first();
    
    // Mark unread messages as read
    await db
      .prepare(`
        UPDATE messages
        SET read = 1
        WHERE connection_id = ? AND sender_id != ? AND read = 0
      `)
      .bind(connectionId, session.userId)
      .run();
    
    return Response.json({
      connection,
      messages: messages.results,
      otherUser
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { connectionId: string } }
) {
  const session = getSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const connectionId = params.connectionId;
  
  if (!connectionId) {
    return Response.json(
      { error: 'Connection ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const { content } = await request.json();
    
    if (!content) {
      return Response.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }
    
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Verify connection exists, is accepted, and user is part of it
    const connection = await db
      .prepare(`
        SELECT * FROM connections
        WHERE id = ? AND status = 'accepted' AND (teacher_id = ? OR learner_id = ?)
        LIMIT 1
      `)
      .bind(connectionId, session.userId, session.userId)
      .first<any>();
    
    if (!connection) {
      return Response.json(
        { error: 'Connection not found, not accepted, or you do not have access to it' },
        { status: 404 }
      );
    }
    
    // Add message
    const result = await db
      .prepare(`
        INSERT INTO messages (connection_id, sender_id, content, read)
        VALUES (?, ?, ?, 0)
        RETURNING *
      `)
      .bind(connectionId, session.userId, content)
      .first();
    
    if (!result) {
      throw new Error('Failed to send message');
    }
    
    // Get recipient ID
    const recipientId = connection.teacher_id === session.userId 
      ? connection.learner_id 
      : connection.teacher_id;
    
    // Create notification for recipient
    await createMessageReceivedNotification(
      db,
      recipientId,
      session.userId,
      `${session.firstName} ${session.lastName}`,
      parseInt(connectionId)
    );
    
    return Response.json({
      success: true,
      message: result
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
