import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Frame } from './screens/Frame';
import { PrivateBeta } from './screens/PrivateBeta';
import { Waitlist } from './screens/Waitlist';
import { WaitlistSuccess } from './screens/WaitlistSuccess';
import { supabase } from './lib/supabaseClient';

function AuthRedirector() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userEmail = session.user.email;
        const { data: codeData } = await supabase
          .from('invitation_codes')
          .select('*')
          .eq('assigned_email', userEmail)
          .eq('used', true)
          .maybeSingle();
        if (codeData && location.pathname === '/') {
          navigate('/dashboard'); // Change to your dashboard route
        } else if (!codeData && location.pathname === '/') {
          navigate('/private-beta');
        }
      }
    };
    checkSessionAndRedirect();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userEmail = session.user.email;
        supabase
          .from('invitation_codes')
          .select('*')
          .eq('assigned_email', userEmail)
          .eq('used', true)
          .maybeSingle()
          .then(({ data: codeData }) => {
            if (codeData && location.pathname === '/') {
              navigate('/dashboard');
            } else if (!codeData && location.pathname === '/') {
              navigate('/private-beta');
            }
          });
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate, location]);
  return null;
}

function App() {
  return (
    <Router>
      <AuthRedirector />
      <Routes>
        <Route path="/" element={<Frame />} />
        <Route path="/private-beta" element={<PrivateBeta />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/waitlist-success" element={<WaitlistSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;