'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function OAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Get the hash fragment from the URL
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const expiresAt = params.get('expires_at');
      
      console.log('OAuth handler received tokens:', { 
        accessToken: !!accessToken, 
        refreshToken: !!refreshToken,
        expiresAt 
      });

      if (accessToken && refreshToken) {
        try {
          // Set the session with the tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Error setting session:', error);
            router.push('/');
            return;
          }

          console.log('Session set successfully');
          
          // Check if user has invitation code and redirect accordingly
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: codeData } = await supabase
              .from('invitation_codes')
              .select('*')
              .eq('assigned_email', user.email)
              .eq('used', true)
              .maybeSingle();

            if (codeData) {
              // Check if user has completed onboarding
              const { data: onboardingData } = await supabase
                .from('onboarding_data')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

              if (onboardingData) {
                router.push('/dashboard');
              } else {
                router.push('/onboarding');
              }
            } else {
              router.push('/private-beta');
            }
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error in OAuth handler:', error);
          router.push('/');
        }
      } else {
        console.log('No tokens found in URL');
        router.push('/');
      }
    };

    handleOAuthRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
} 