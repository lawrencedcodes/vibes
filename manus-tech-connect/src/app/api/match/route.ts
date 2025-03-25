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
  
  // Only learners can use the matching feature
  if (session.role !== 'learner') {
    return Response.json(
      { error: 'Only learners can use the matching feature' },
      { status: 403 }
    );
  }
  
  try {
    // Get database from environment
    const db = (process.env as any).DB as D1Database;
    
    // Get learner's technologies and availability
    const learnerTechnologies = await db
      .prepare(`
        SELECT ut.technology_id, t.name as technology_name
        FROM user_technologies ut
        JOIN technologies t ON ut.technology_id = t.id
        WHERE ut.user_id = ?
      `)
      .bind(session.userId)
      .all();
    
    if (!learnerTechnologies.results.length) {
      return Response.json(
        { error: 'You need to select at least one technology to find a match' },
        { status: 400 }
      );
    }
    
    const learnerAvailability = await db
      .prepare('SELECT day_of_week, start_time, end_time FROM user_availability WHERE user_id = ?')
      .bind(session.userId)
      .all();
    
    if (!learnerAvailability.results.length) {
      return Response.json(
        { error: 'You need to set your availability to find a match' },
        { status: 400 }
      );
    }
    
    // Find teachers with matching technologies and availability
    const techIds = learnerTechnologies.results.map((tech: any) => tech.technology_id);
    const techPlaceholders = techIds.map(() => '?').join(',');
    
    // Complex query to find matching teachers
    const query = `
      WITH teacher_matches AS (
        SELECT 
          u.id as teacher_id, 
          u.first_name as teacher_first_name,
          u.last_name as teacher_last_name,
          u.photo_url as teacher_photo,
          ut.technology_id,
          t.name as technology_name,
          ut.proficiency_level,
          COUNT(DISTINCT ua.day_of_week) as matching_days_count
        FROM users u
        JOIN user_technologies ut ON u.id = ut.user_id
        JOIN technologies t ON ut.technology_id = t.id
        JOIN user_availability ua ON u.id = ua.user_id
        WHERE 
          u.role = 'teacher' AND
          ut.technology_id IN (${techPlaceholders}) AND
          EXISTS (
            SELECT 1 FROM user_availability la
            WHERE 
              la.user_id = ? AND
              la.day_of_week = ua.day_of_week AND
              la.start_time <= ua.end_time AND
              la.end_time >= ua.start_time
          )
        GROUP BY u.id, ut.technology_id
        ORDER BY matching_days_count DESC, ut.proficiency_level DESC
        LIMIT 1
      )
      SELECT 
        tm.*,
        GROUP_CONCAT(DISTINCT day_names.name) as matching_days
      FROM teacher_matches tm
      JOIN user_availability ta ON tm.teacher_id = ta.user_id
      JOIN user_availability la ON la.user_id = ? AND
                                  la.day_of_week = ta.day_of_week AND
                                  la.start_time <= ta.end_time AND
                                  la.end_time >= ta.start_time
      JOIN (
        SELECT 0 as day_of_week, 'Sunday' as name
        UNION SELECT 1, 'Monday'
        UNION SELECT 2, 'Tuesday'
        UNION SELECT 3, 'Wednesday'
        UNION SELECT 4, 'Thursday'
        UNION SELECT 5, 'Friday'
        UNION SELECT 6, 'Saturday'
      ) day_names ON la.day_of_week = day_names.day_of_week
    `;
    
    const params = [...techIds, session.userId, session.userId];
    const matchResult = await db.prepare(query).bind(...params).first();
    
    if (!matchResult) {
      return Response.json({ match: null });
    }
    
    // Parse matching days from string to array
    const match = {
      ...matchResult,
      matching_days: (matchResult as any).matching_days.split(',')
    };
    
    return Response.json({ match });
  } catch (error) {
    console.error('Matching error:', error);
    return Response.json(
      { error: 'Failed to find a match' },
      { status: 500 }
    );
  }
}
