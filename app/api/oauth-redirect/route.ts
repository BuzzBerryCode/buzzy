import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const hash = url.hash;
  
  // Extract the access token and other params from the hash
  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  
  // Redirect to localhost with the tokens
  const redirectUrl = new URL('http://localhost:3000/auth/callback');
  redirectUrl.searchParams.set('access_token', accessToken || '');
  redirectUrl.searchParams.set('refresh_token', refreshToken || '');
  
  return NextResponse.redirect(redirectUrl);
} 