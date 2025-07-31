'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/');
        return;
      }
      setIsLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          router.push('/');
        }
      }
    );

    getInitialSession();

    return () => subscription.unsubscribe();
  }, [router]);

  // Show minimal placeholder while loading to avoid white page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Minimal placeholder - just background color */}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to Buzzberry Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Your onboarding is complete! This is where your dashboard functionality will be integrated.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              Next Steps:
            </h2>
            <ul className="text-purple-800 space-y-1">
              <li>• Integrate your existing dashboard components</li>
              <li>• Connect with your backend APIs</li>
              <li>• Add user management features</li>
              <li>• Implement the full SaaS functionality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 