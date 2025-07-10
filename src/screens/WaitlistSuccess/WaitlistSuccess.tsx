import React from "react";
import { useNavigate } from "react-router-dom";
import { VideoBackground } from "../../components/VideoBackground";
import { MobileVideoBackground } from "../../components/MobileVideoBackground";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const WaitlistSuccess = (): JSX.Element => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/');
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
                You're In!
              </h1>
              
              <div className="space-y-3">
                <p className="text-[#757575] text-sm leading-relaxed">
                  🎉 You've successfully joined our exclusive waitlist!
                </p>
                
                <div className="bg-[#f8f9fa] rounded-xl p-3 border border-[#e9ecef]">
                  <p className="text-[#1e1e1e] text-sm leading-relaxed">
                    <strong>What's next?</strong>
                    <br />
                    You'll receive an email within <span className="text-[#d266a3] font-semibold">24 hours</span> to see if you've been accepted into our private beta.
                  </p>
                </div>
                
                <p className="text-[#757575] text-xs">
                  Keep an eye on your inbox (and spam folder) for updates.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleBackToLogin}
              className="w-full h-12 bg-[#d266a3] hover:bg-[#c15594] rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-screen w-full">
        <div className="h-screen w-full flex">
          {/* Left panel with video and success icon */}
          <div className="flex-[1.2] h-full bg-gradient-to-br from-purple-400 to-indigo-500 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <VideoBackground />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-white/20 shadow-2xl">
                <div className="text-center space-y-8">
                  {/* Success Icon */}
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl relative z-10">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  {/* Bottom text */}
                  <div className="text-black text-2xl font-medium relative z-10">
                    Welcome to the waitlist!
                    <br />
                    Check your email soon.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Success content */}
          <div className="flex-1 h-full flex items-center justify-center p-8">
            <div className="w-full max-w-md">
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
                        You're In!
                      </h1>
                    </div>

                    {/* Message */}
                    <div className="space-y-4">
                      <p className="text-[#757575] text-lg text-center leading-relaxed">
                        🎉 You've successfully joined our exclusive waitlist!
                      </p>
                      
                      <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-[#e9ecef]">
                        <p className="text-[#1e1e1e] text-base leading-relaxed">
                          <strong>What's next?</strong>
                          <br />
                          You'll receive an email within <span className="text-[#d266a3] font-semibold">24 hours</span> to see if you've been accepted into our private beta program.
                        </p>
                      </div>
                      
                      <p className="text-[#757575] text-sm">
                        Keep an eye on your inbox (and spam folder) for updates from the Buzzberry team.
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={handleBackToLogin}
                    className="w-full h-[50px] bg-[#d266a3] hover:bg-[#c15594] rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Back to Login
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};