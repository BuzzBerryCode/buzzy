'use client';

import { EyeOffIcon, EyeIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { VideoBackground } from "./components/VideoBackground";
import { MobileVideoBackground } from "./components/MobileVideoBackground";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { supabase } from './lib/supabaseClient';

export default function Frame(): React.ReactElement | null {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }
      // Try sign in first
      let userEmail = formData.email;
      let userSession = null;
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (signInError) {
        // If user not found, try sign up
        if (signInError.message.toLowerCase().includes('invalid login credentials')) {
          const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
          });
          if (signUpError) {
            console.error('Sign up error:', signUpError.message);
            setError(signUpError.message);
            setLoading(false);
            return;
          }
          userSession = signUpData.session;
        } else {
          console.error('Sign in error:', signInError.message);
          setError(signInError.message);
          setLoading(false);
          return;
        }
      } else {
        userSession = signInData.session;
      }
      // Check if user has a validated invitation code
      const { data: codeData, error: codeError } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('assigned_email', userEmail)
        .eq('used', true)
        .maybeSingle();
      if (codeError) {
        console.error('Invitation code check error:', codeError.message);
      }
      setLoading(false);
      if (codeData) {
        // Check if user has completed onboarding
        const { data: onboardingData, error: onboardingError } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('user_id', userSession?.user?.id)
          .maybeSingle();
        
        if (onboardingError) {
          console.error('Onboarding check error:', onboardingError.message);
        }
        
        if (onboardingData) {
          console.log('User has completed onboarding, navigating to dashboard');
          router.push('/dashboard');
        } else {
          console.log('User needs to complete onboarding, navigating to onboarding');
          router.push('/onboarding');
        }
      } else {
        console.log('User does not have validated invitation code, navigating to /private-beta');
        router.push('/private-beta');
      }
    } catch (err) {
      console.error('Unexpected error in handleContinue:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    // Try to use a custom redirect URL that should work with the current Supabase settings
    const { error: googleError } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/oauth-handler`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (googleError) {
      setError(googleError.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Mobile Layout - Video Background with Content Overlay */}
      <div className="lg:hidden h-screen w-full relative overflow-hidden bg-black">
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
                Less Work
                <br />
                More Influence
              </h1>
              
              <p className="text-[#757575] text-sm leading-relaxed">
                Creator marketing made effortless, fast&nbsp;and&nbsp;targeted.
              </p>
            </div>

            {/* Google Sign In Button */}
            <Button
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-3 px-4 py-2 rounded-xl border border-[#d266a3] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] mb-4"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img
                className="w-6 h-6 object-contain"
                alt="Google icon"
                src="/Google Icon 2.png"
                onError={(e) => {
                  console.error('Failed to load Google icon');
                  e.currentTarget.outerHTML = '<div class="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center font-bold text-sm">G</div>';
                }}
              />
              <span className="font-medium text-[#545454] text-base">
                Sign In With Google
              </span>
            </Button>
            {/* Error message */}
            {!!error && (
              <div className="text-red-500 text-xs mb-2 text-center">{error}</div>
            )}

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Separator className="flex-1" />
              <span className="font-medium text-[#959595] text-sm px-2">
                Or
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Form Fields */}
            <div className="space-y-3 mb-4">
              {/* Email field */}
              <div className="space-y-1">
                <label className="font-medium text-[#1e1e1e] text-xs block">
                  Email
                </label>
                <Input
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="please enter your email"
                  className="h-[42px] px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-sm focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                />
              </div>
              {/* Password field */}
              <div className="space-y-1">
                <label className="font-medium text-[#1e1e1e] text-xs block">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    placeholder="choose your password"
                    className="h-[42px] px-3 py-2 pr-10 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-sm focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            {/* Continue button */}
            <Button 
              onClick={handleContinue}
              className="w-full h-12 bg-[#d266a3] hover:bg-[#c15594] rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mb-3"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Continue'}
            </Button>

            {/* Terms text */}
            <p className="font-medium text-[#959595] text-xs text-center leading-relaxed">
              By Clicking "continue", <br /> You Agree To The Terms Of
              Service And Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:block h-screen w-full">
        <div className="h-screen w-full flex">
          {/* Video panel - takes up more space on larger screens */}
          <div className="flex-[1.2] h-full bg-gradient-to-br from-purple-400 to-indigo-500 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <VideoBackground />
            </div>
          </div>

          {/* Login section - takes up remaining space */}
          <div className="flex-1 h-full flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <Card className="w-full bg-white border-none shadow-none">
                <CardContent className="p-0 space-y-8">
                  {/* Logo and headline section */}
                  <div className="text-center space-y-4">
                    {/* Logo - much tighter spacing */}
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
                      <h1 className="font-bold text-[#1e1e1e] text-3xl xl:text-4xl text-center tracking-tight leading-tight">
                        Less Work
                        <br /> 
                        More Influence
                      </h1>
                    </div>

                    {/* Tagline */}
                    <p className="text-[#757575] text-base text-center leading-relaxed">
                      Creator marketing made effortless, fast and targeted.
                    </p>
                  </div>

                  {/* Google Sign In Button */}
                  <Button
                    variant="outline"
                    className="w-full h-11 flex items-center justify-center gap-3 px-5 py-2 rounded-lg border border-[#d266a3] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <img
                      className="w-6 h-6 object-contain"
                      alt="Google icon"
                      src="/Google Icon 2.png"
                      onError={(e) => {
                        console.error('Failed to load Google icon');
                        e.currentTarget.outerHTML = '<div class="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center font-bold text-sm">G</div>';
                      }}
                    />
                    <span className="font-medium text-[#545454] text-base">
                      Sign In With Google
                    </span>
                  </Button>
                  {/* Error message */}
                  {!!error && (
                    <div className="text-red-500 text-xs mb-2 text-center">{error}</div>
                  )}
                  {/* Form section */}
                  <div className="space-y-6">
                    {/* Divider */}
                    <div className="flex items-center justify-center gap-4">
                      <Separator className="flex-1" />
                      <span className="font-medium text-[#959595] text-sm px-2">
                        Or
                      </span>
                      <Separator className="flex-1" />
                    </div>
                    {/* Email field */}
                    <div className="space-y-2">
                      <label className="font-medium text-[#1e1e1e] text-xs block">
                        Email
                      </label>
                      <Input
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        placeholder="please enter your email"
                        className="h-[50px] px-4 py-3 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-base focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    {/* Password field */}
                    <div className="space-y-2">
                      <label className="font-medium text-[#1e1e1e] text-xs block">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={e => handleInputChange('password', e.target.value)}
                          placeholder="choose your password"
                          className="h-[50px] px-4 py-3 pr-12 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-base focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    {/* Continue button */}
                    <Button 
                      onClick={handleContinue}
                      className="w-full h-[50px] bg-[#d266a3] hover:bg-[#c15594] rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Continue'}
                    </Button>
                    {/* Terms text */}
                    <p className="font-medium text-[#959595] text-sm text-center leading-relaxed">
                      By Clicking "continue", <br /> You Agree To The Terms Of
                      Service And Privacy Policy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 