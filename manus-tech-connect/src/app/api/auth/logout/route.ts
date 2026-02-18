export const runtime = "edge";
import { clearSession } from '@/lib/auth/auth-utils';

export async function POST() {
  // Clear the session cookie
  clearSession();
  
  return Response.json({ success: true });
}
