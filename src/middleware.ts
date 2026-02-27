// © AIRX (individual business). All rights reserved.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This helper function handles GitHub Codespace environment
function handleGitHubCodespace(req: NextRequest): NextResponse | null {
  const url = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || url.host;

  if (host.includes('.app.github.dev')) {
    const headers = new Headers(req.headers);
    headers.set('x-forwarded-host', host);
    headers.set('origin', url.origin);

    return NextResponse.next({
      request: {
        headers
      }
    });
  }
  return null;
}

export default function middleware(req: NextRequest) {
  // Keep Codespace compatibility (harmless on Render)
  const codespaceResponse = handleGitHubCodespace(req);
  if (codespaceResponse) return codespaceResponse;

  // Allow all requests for now.
  // (Auth + route protection will be re-implemented per LOOKUP9 spec in the next iteration.)
  return NextResponse.next();
}

// Stop Middleware running on static files and api routes
export const config = {
  matcher: [
    '/((?!api|_next|_static|_vercel|favicon.ico).*)',
  ]
};
