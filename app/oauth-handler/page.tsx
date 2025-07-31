'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function OAuthHandler() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

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
          
          // Wait a moment for session to be fully set, then check user
          setTimeout(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              console.log('User found:', user.email);
              
              // Check if user has invitation code and redirect accordingly
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
                  console.log('User has completed onboarding, redirecting to dashboard');
                  router.push('/dashboard');
                } else {
                  console.log('User needs onboarding, redirecting to onboarding');
                  router.push('/onboarding');
                }
              } else {
                console.log('User needs invitation code, redirecting to private-beta');
                router.push('/private-beta');
              }
            } else {
              console.log('No user found after session set');
              router.push('/');
            }
          }, 100); // Small delay to ensure session is set
        } catch (error) {
          console.error('Error in OAuth handler:', error);
          router.push('/');
        }
      } else {
        console.log('No tokens found in URL');
        router.push('/');
      }
    };

    // Add a fallback timeout to prevent getting stuck
    const timeout = setTimeout(() => {
      console.log('OAuth handler timeout, redirecting to home');
      router.push('/');
    }, 5000); // 5 second timeout

    handleOAuthRedirect();

    return () => clearTimeout(timeout);
  }, [router]);

  // Show minimal placeholder while processing to avoid white page
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Minimal placeholder - just background color */}
    </div>
  );
} 