import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  
  // Handle both hash and query parameters
  let code = requestUrl.searchParams.get('code');
  let accessToken = requestUrl.searchParams.get('access_token');
  let refreshToken = requestUrl.searchParams.get('refresh_token');
  
  // If we have a hash fragment, parse it
  if (requestUrl.hash) {
    const hashParams = new URLSearchParams(requestUrl.hash.substring(1));
    accessToken = accessToken || hashParams.get('access_token');
    refreshToken = refreshToken || hashParams.get('refresh_token');
  }

  console.log('OAuth callback received:', { code, accessToken: !!accessToken, refreshToken: !!refreshToken });

  try {
    if (code) {
      // Handle authorization code flow
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Auth callback error:', error);
      }
    } else if (accessToken && refreshToken) {
      // Handle implicit flow (direct tokens)
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      if (error) {
        console.error('Session set error:', error);
      }
    }
  } catch (error) {
    console.error('Error in auth callback:', error);
  }

  // Redirect to home page
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 