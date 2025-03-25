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
    const { day_of_week, start_time, end_time } = await request.json();
    
    // Validate input
    if (day_of_week === undefined || !start_time || !end_time) {
      return Response.json(
        { error: 'Day of week, start time, and end time are required' },
        { status: 400 }
      );
    }
    
    // Validate day of week
    if (day_of_week < 0 || day_of_week > 6) {
      return Response.json(
        { error: 'Day of week must be between 0 (Sunday) and 6 (Saturday)' },
        { status: 400 }
      );
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return Response.json(
        { error: 'Times must be in 24-hour format (HH:MM)' },
        { status: 400 }
      );
    }
    
    // Validate start time is before end time
    if (start_time >= end_time) {
      return Response.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      );
    }
    
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Check if availability already exists for this day
    const existingAvailability = await db
      .prepare('SELECT id FROM user_availability WHERE user_id = ? AND day_of_week = ? LIMIT 1')
      .bind(session.userId, day_of_week)
      .first<{ id: number }>();
    
    let result;
    
    if (existingAvailability) {
      // Update existing availability
      result = await db
        .prepare(`
          UPDATE user_availability
          SET start_time = ?, end_time = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ? AND day_of_week = ?
          RETURNING *
        `)
        .bind(start_time, end_time, session.userId, day_of_week)
        .first();
    } else {
      // Add new availability
      result = await db
        .prepare(`
          INSERT INTO user_availability (user_id, day_of_week, start_time, end_time)
          VALUES (?, ?, ?, ?)
          RETURNING *
        `)
        .bind(session.userId, day_of_week, start_time, end_time)
        .first();
    }
    
    if (!result) {
      return Response.json(
        { error: 'Failed to update availability' },
        { status: 500 }
      );
    }
    
    return Response.json({
      success: true,
      availability: result
    });
  } catch (error) {
    console.error('Availability update error:', error);
    return Response.json(
      { error: 'Failed to update availability' },
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
  const day_of_week = url.searchParams.get('day_of_week');
  
  if (day_of_week === null) {
    return Response.json(
      { error: 'Day of week is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Delete availability for this day
    const result = await db
      .prepare('DELETE FROM user_availability WHERE user_id = ? AND day_of_week = ?')
      .bind(session.userId, day_of_week)
      .run();
    
    if (!result.success) {
      return Response.json(
        { error: 'Failed to remove availability' },
        { status: 500 }
      );
    }
    
    return Response.json({
      success: true
    });
  } catch (error) {
    console.error('Availability removal error:', error);
    return Response.json(
      { error: 'Failed to remove availability' },
      { status: 500 }
    );
  }
}
