import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import ory from './lib/ory';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  try {
    // Check if the user has a valid session
    await ory.toSession(req.cookies.get('ory_session'));
    return NextResponse.next(); // Allow the request
  } catch (error) {
    // Redirect to login if the session is invalid
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

// Define which paths should be protected
export const config = {
  matcher: ['/dashboard/:path*'],
};
