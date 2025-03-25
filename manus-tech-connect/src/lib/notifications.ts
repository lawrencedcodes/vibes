import { D1Database } from '@cloudflare/workers-types';
import { getSession } from '@/lib/auth/auth-utils';

// Helper function to create a notification
export async function createNotification(
  db: D1Database,
  {
    userId,
    senderId = null,
    type,
    content,
    connectionId = null
  }: {
    userId: number;
    senderId?: number | null;
    type: 'connection_request' | 'connection_accepted' | 'connection_rejected' | 'message_received';
    content: string;
    connectionId?: number | null;
  }
) {
  try {
    const result = await db
      .prepare(`
        INSERT INTO notifications (user_id, sender_id, type, content, connection_id, is_read)
        VALUES (?, ?, ?, ?, ?, 0)
        RETURNING id
      `)
      .bind(userId, senderId, type, content, connectionId)
      .first<{ id: number }>();
    
    return result?.id;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

// Function to create connection request notification
export async function createConnectionRequestNotification(
  db: D1Database,
  teacherId: number,
  learnerId: number,
  learnerName: string,
  connectionId: number,
  technologyName: string
) {
  const content = `${learnerName} wants to connect with you to learn ${technologyName}.`;
  
  return createNotification(db, {
    userId: teacherId,
    senderId: learnerId,
    type: 'connection_request',
    content,
    connectionId
  });
}

// Function to create connection accepted notification
export async function createConnectionAcceptedNotification(
  db: D1Database,
  learnerId: number,
  teacherId: number,
  teacherName: string,
  connectionId: number,
  technologyName: string
) {
  const content = `${teacherName} has accepted your request to learn ${technologyName}.`;
  
  return createNotification(db, {
    userId: learnerId,
    senderId: teacherId,
    type: 'connection_accepted',
    content,
    connectionId
  });
}

// Function to create connection rejected notification
export async function createConnectionRejectedNotification(
  db: D1Database,
  learnerId: number,
  teacherId: number,
  teacherName: string,
  connectionId: number,
  technologyName: string
) {
  const content = `${teacherName} has declined your request to learn ${technologyName}.`;
  
  return createNotification(db, {
    userId: learnerId,
    senderId: teacherId,
    type: 'connection_rejected',
    content,
    connectionId
  });
}

// Function to create message received notification
export async function createMessageReceivedNotification(
  db: D1Database,
  recipientId: number,
  senderId: number,
  senderName: string,
  connectionId: number
) {
  const content = `You have received a new message from ${senderName}.`;
  
  return createNotification(db, {
    userId: recipientId,
    senderId,
    type: 'message_received',
    content,
    connectionId
  });
}
