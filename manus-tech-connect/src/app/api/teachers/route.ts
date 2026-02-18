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
    
    // Get all teachers with their technologies and availability
    const query = `
      SELECT 
        u.id, u.first_name, u.last_name, u.email, u.photo_url, u.role,
        t.id as tech_id, t.name as tech_name, t.description as tech_description,
        ut.proficiency_level,
        ua.day_of_week, ua.start_time, ua.end_time
      FROM users u
      LEFT JOIN user_technologies ut ON u.id = ut.user_id
      LEFT JOIN technologies t ON ut.technology_id = t.id
      LEFT JOIN user_availability ua ON u.id = ua.user_id
      WHERE u.role = 'teacher'
    `;
    
    const results = await db.prepare(query).all();
    
    if (!results.success) {
      throw new Error('Failed to fetch teachers');
    }
    
    // Process results to group by teacher
    const teachersMap = new Map();
    
    results.results.forEach((row: any) => {
      if (!teachersMap.has(row.id)) {
        teachersMap.set(row.id, {
          id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          photo_url: row.photo_url,
          role: row.role,
          technologies: [],
          availability: []
        });
      }
      
      const teacher = teachersMap.get(row.id);
      
      // Add technology if not already added
      if (row.tech_id && !teacher.technologies.some((t: any) => t.id === row.tech_id)) {
        teacher.technologies.push({
          id: row.tech_id,
          name: row.tech_name,
          description: row.tech_description,
          proficiency_level: row.proficiency_level
        });
      }
      
      // Add availability if not already added
      if (row.day_of_week !== null && !teacher.availability.some((a: any) => a.day_of_week === row.day_of_week)) {
        teacher.availability.push({
          day_of_week: row.day_of_week,
          start_time: row.start_time,
          end_time: row.end_time
        });
      }
    });
    
    const teachers = Array.from(teachersMap.values());
    
    return Response.json({ teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return Response.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}
