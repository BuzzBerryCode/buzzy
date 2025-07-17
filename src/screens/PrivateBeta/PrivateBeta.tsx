import React from "react";
import { useNavigate } from "react-router-dom";
import { VideoBackground } from "../../components/VideoBackground";
import { MobileVideoBackground } from "../../components/MobileVideoBackground";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { supabase } from '../../lib/supabaseClient';

export const PrivateBeta = (): React.ReactElement | null => {
  const navigate = useNavigate();
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [invitationCode, setInvitationCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleJoinWaitlist = () => {
    navigate('/waitlist');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleInvitationSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    console.log('handleInvitationSubmit called', { invitationCode });
    setError(null);
    setLoading(true);
    // Validate invitation code
    const { data: codeData, error: codeError } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('code', invitationCode)
      .eq('used', false)
      .single();
    if (codeError || !codeData) {
      setError('Invalid or already used invitation code.');
      setLoading(false);
      return;
    }
    // Mark invitation code as used
    await supabase
      .from('invitation_codes')
      .update({ used: true, assigned_email: session.user.email })
      .eq('id', codeData.id);
    setLoading(false);
    navigate('/dashboard'); // Change to your dashboard route
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Mobile Layout - Video Background with Content Overlay */}
      <div className="h-screen w-full relative overflow-hidden bg-black">
        <div style={{position: 'absolute', top: 0, left: 0, zIndex: 100, background: 'rgba(255,255,255,0.8)', width: '100%', textAlign: 'center', fontWeight: 'bold'}}>MOBILE FORM</div>
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <MobileVideoBackground />
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 h-full flex flex-col justify-center items-center p-6" style={{ zIndex: 10 }}>
          {/* Content Box */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30 w-full max-w-sm">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg bg-cover bg-center bg-no-repeat shadow-sm flex-shrink-0"
                  style={{
                    backgroundImage: `url(/BuzzberryIcon.png)`
                  }}
                />
                <img
                  className="w-[80px] h-4 object-contain"
                  alt="Buzzberry black logo"
                  src="/Buzzberry black logo(4) 1.png"
                  onError={(e) => {
                    console.error('Failed to load Buzzberry logo');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-3 mb-6">
              <h1 className="text-2xl font-bold text-[#1e1e1e] leading-tight">
                Login Successful
              </h1>
              <p className="text-[#757575] text-sm leading-relaxed">
                We're currently in private beta.<br />
                Please enter your invitation code.
              </p>
            </div>
            {/* Form Fields */}
            <form onSubmit={handleInvitationSubmit} className="space-y-3 mb-4">
              <div className="space-y-1">
                <label className="font-medium text-[#1e1e1e] text-xs block">
                  Invitation Code
                </label>
                <Input
                  value={invitationCode}
                  onChange={e => setInvitationCode(e.target.value)}
                  placeholder="Please enter your invitation code"
                  className="h-[42px] px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-sm focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
              {!!error && <div className="text-red-500 text-xs mb-2 text-center">{error}</div>}
              <Button type="submit" className="w-full h-11 bg-[#d266a3] hover:bg-[#c15594] rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mb-4" disabled={loading}>
                {loading ? 'Loading...' : 'Continue'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Separator className="flex-1" />
              <span className="font-medium text-[#959595] text-sm px-2">
                OR
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Join Waitlist button */}
            <Button
              onClick={handleJoinWaitlist}
              variant="outline"
              className="w-full h-10 flex items-center justify-center gap-3 px-4 py-2 rounded-xl border border-[#d266a3] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] mb-3"
            >
              <span className="font-medium text-[#545454] text-base">
                Join Waitlist
              </span>
            </Button>

            {/* Log Out link */}
            <div className="text-center">
              <button
                onClick={handleLogout}
                className="font-medium text-[#959595] text-xs hover:text-[#d266a3] transition-colors underline"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="h-screen w-full">
        <div style={{position: 'absolute', top: 0, left: 0, zIndex: 100, background: 'rgba(0,0,0,0.1)', width: '100%', textAlign: 'center', fontWeight: 'bold', color: '#d266a3'}}>DESKTOP FORM</div>
        <div className="h-screen w-full flex">
          {/* Left panel with gradient and speech bubble */}
          <div className="flex-[1.2] h-full bg-gradient-to-br from-purple-400 to-indigo-500 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <VideoBackground />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-white/20 shadow-2xl">
                <div className="text-center space-y-8">
                  {/* Speech bubble */}
                  <div className="bg-white rounded-3xl p-8 shadow-2xl relative z-10">
                    <p className="text-[#1e1e1e] text-xl font-medium leading-relaxed">
                      Beauty influencers to promote makeup remover, 5,000+ followers
                    </p>
                    {/* Speech bubble tail */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"></div>
                  </div>

                  {/* Bottom text */}
                  <div className="text-black text-lg font-medium z-10 relative">
                    500+ matches in 30 seconds.
                    <br />
                    No search, just results.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Login section */}
          <div className="flex-1 h-full flex items-center justify-center p-8">
            <div className="w-full max-w-md" style={{ zIndex: 10, position: 'relative' }}>
              <Card className="w-full bg-white border-none shadow-none">
                <CardContent className="p-0 space-y-8">
                  {/* Logo and headline section */}
                  <div className="text-center space-y-4">
                    {/* Logo */}
                    <div className="inline-flex items-center gap-1.5">
                      <div 
                        className="w-8 h-8 rounded-lg bg-cover bg-center bg-no-repeat shadow-sm flex-shrink-0"
                        style={{
                          backgroundImage: `url(/BuzzberryIcon.png)`
                        }}
                      />
                      <img
                        className="w-[90px] h-4 object-contain"
                        alt="Buzzberry black logo"
                        src="/Buzzberry black logo(4) 1.png"
                        onError={(e) => {
                          console.error('Failed to load Buzzberry logo');
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Headline */}
                    <div className="space-y-1">
                      <h1 className="font-bold text-[#1e1e1e] text-4xl xl:text-5xl text-center tracking-tight leading-tight">
                        Login Successful
                      </h1>
                    </div>

                    {/* Tagline */}
                    <p className="text-[#757575] text-lg text-center leading-relaxed">
                      We're currently in private beta.
                      <br />
                      Please enter your invitation code.
                    </p>
                  </div>

                  {/* Form section */}
                  <form onSubmit={e => { console.log('DESKTOP FORM SUBMIT'); handleInvitationSubmit(e); }} className="space-y-6">
                    {/* Invitation Code field */}
                    <div className="space-y-2">
                      <label className="font-medium text-[#1e1e1e] text-xs block">
                        Invitation Code
                      </label>
                      <Input
                        value={invitationCode}
                        onChange={e => setInvitationCode(e.target.value)}
                        placeholder="Please enter your invitation code"
                        className="h-[46px] px-3 py-2 bg-[#f0f0f0] rounded-lg border border-[#ebebeb] font-medium text-base focus:ring-2 focus:ring-[#d266a3] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    {!!error && <div className="text-red-500 text-xs mb-2 text-center">{error}</div>}
                    {/* Continue button */}
                    <Button
                      type="submit"
                      className="w-full h-[47px] bg-[#d266a3] hover:bg-[#c15594] rounded-lg font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Continue'}
                    </Button>
                    {/* Divider */}
                    <div className="flex items-center justify-center gap-4">
                      <Separator className="flex-1" />
                      <span className="font-medium text-[#959595] text-sm px-2">
                        OR
                      </span>
                      <Separator className="flex-1" />
                    </div>
                    {/* Join Waitlist button */}
                    <Button
                      onClick={handleJoinWaitlist}
                      variant="outline"
                      className="w-full h-11 flex items-center justify-center gap-3 px-5 py-2 rounded-lg border border-[#d266a3] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <span className="font-medium text-[#545454] text-base">
                        Join Waitlist
                      </span>
                    </Button>
                    {/* Log Out link */}
                    <div className="text-center">
                      <button
                        onClick={handleLogout}
                        className="font-medium text-[#959595] text-sm hover:text-[#d266a3] transition-colors underline"
                        type="button"
                      >
                        Log Out
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};