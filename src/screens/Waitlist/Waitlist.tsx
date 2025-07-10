import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoBackground } from "../../components/VideoBackground";
import { MobileVideoBackground } from "../../components/MobileVideoBackground";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { SocialIcons } from "../../components/SocialIcons";
import { supabase } from '../../lib/supabaseClient';

export const Waitlist = (): React.ReactElement | null => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    websiteUrl: '',
    position: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Basic validation
    if (!formData.email || !formData.companyName || !formData.websiteUrl || !formData.position) {
      setError('Please fill in all fields.');
      return;
    }
    // Submit to Supabase
    const { error: supabaseError } = await supabase.from('waitlist').insert([
      {
        email: formData.email,
        company_name: formData.companyName,
        website_url: formData.websiteUrl,
        position: formData.position,
      },
    ]);
    if (supabaseError) {
      if (supabaseError.code === '23505') {
        setError('This email is already on the waitlist.');
      } else {
        setError('Failed to join waitlist. Please try again.');
      }
      return;
    }
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (isSubmitted) {
    navigate('/waitlist-success');
    return null;
  }

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
            <div className="text-center space-y-3 mb-4">
              <h1 className="text-2xl font-bold text-[#1e1e1e] leading-tight">
                Join Waitlist
              </h1>
              
              <p className="text-[#757575] text-sm leading-relaxed">
                Get early access to Buzzberry when we launch.
              </p>
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {!!error && (
                <div className="text-red-500 text-xs mb-2">{error}</div>
              )}
              {/* Email field */}
              <div className="space-y-1">
                <label className="font-medium text-[#1e1e1e] text-xs block">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="please enter your email"
                  className="h-[38px] px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-sm focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Company Name field */}
              <div className="space-y-1">
                <label className="font-medium text-[#1e1e1e] text-xs block">
                  Company Name
                </label>
                <Input
                  required
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="please enter your company name"
                  className="h-[38px] px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-sm focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Website URL field */}
              <div className="space-y-1">
                <label className="font-medium text-[#1e1e1e] text-xs block">
                  Website URL
                </label>
                <Input
                  required
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="www.yourwebsite.com"
                  className="h-[38px] px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-sm focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Position field */}
              <div className="space-y-1">
                <label className="font-medium text-[#1e1e1e] text-xs block">
                  Position
                </label>
                <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)} required>
                  <SelectTrigger className="h-[38px] px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] font-medium text-sm focus:ring-2 focus:ring-[#d266a3] focus:border-[#d266a3] focus:bg-white transition-all shadow-sm">
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#e9ecef] rounded-xl shadow-xl overflow-hidden">
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="co-founder">Co-Founder</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="cmo">CMO</SelectItem>
                    <SelectItem value="marketing-director">Marketing Director</SelectItem>
                    <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit button */}
              <Button 
                type="submit"
                className="w-full h-11 bg-[#d266a3] hover:bg-[#c15594] rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mt-4"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-screen w-full">
        <div className="h-screen w-full flex">
          {/* Left panel with gradient and social icons */}
          <div className="flex-[1.2] h-full bg-gradient-to-br from-purple-400 to-indigo-500 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <VideoBackground />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-white/20 shadow-2xl">
                <div className="text-center space-y-8">
                  {/* Social Icons */}
                  <div className="relative z-10">
                    <SocialIcons />
                  </div>

                  {/* Bottom text */}
                  <div className="text-black text-2xl font-medium relative z-10">
                    Multi-platform, one workflow.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Form section */}
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
                        Join Waitlist
                      </h1>
                    </div>

                    {/* Tagline */}
                    <p className="text-[#757575] text-lg text-center leading-relaxed">
                      Get early access to Buzzberry when we launch.
                    </p>
                  </div>

                  {/* Form section */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!!error && (
                      <div className="text-red-500 text-xs mb-2">{error}</div>
                    )}
                    {/* Email field */}
                    <div className="space-y-2">
                      <label className="font-medium text-[#1e1e1e] text-xs block">
                        Email
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="please enter your email"
                        className="h-[52px] px-4 py-3 bg-white rounded-2xl border-2 border-[#f1f3f4] font-normal text-base placeholder:text-[#9aa0a6] focus:ring-0 focus:border-[#d266a3] focus:outline-none transition-all duration-200 shadow-sm hover:border-[#dadce0] hover:shadow-md"
                      />
                    </div>

                    {/* Company Name field */}
                    <div className="space-y-2">
                      <label className="font-medium text-[#1e1e1e] text-xs block">
                        Company Name
                      </label>
                      <Input
                        required
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="please enter your company name"
                        className="h-[52px] px-4 py-3 bg-white rounded-2xl border-2 border-[#f1f3f4] font-normal text-base placeholder:text-[#9aa0a6] focus:ring-0 focus:border-[#d266a3] focus:outline-none transition-all duration-200 shadow-sm hover:border-[#dadce0] hover:shadow-md"
                      />
                    </div>

                    {/* Website URL field */}
                    <div className="space-y-2">
                      <label className="font-medium text-[#1e1e1e] text-xs block">
                        Website URL
                      </label>
                      <Input
                        required
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="www.yourwebsite.com"
                        className="h-[52px] px-4 py-3 bg-white rounded-2xl border-2 border-[#f1f3f4] font-normal text-base placeholder:text-[#9aa0a6] focus:ring-0 focus:border-[#d266a3] focus:outline-none transition-all duration-200 shadow-sm hover:border-[#dadce0] hover:shadow-md"
                      />
                    </div>

                    {/* Position field */}
                    <div className="space-y-2">
                      <label className="font-medium text-[#1e1e1e] text-xs block">
                        Position
                      </label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)} required>
                        <SelectTrigger className="h-[52px] px-4 py-3 bg-white rounded-2xl border-2 border-[#f1f3f4] font-normal text-base focus:ring-0 focus:border-[#d266a3] focus:outline-none transition-all duration-200 shadow-sm hover:border-[#dadce0] hover:shadow-md data-[placeholder]:text-[#9aa0a6]">
                          <SelectValue placeholder="Select your position" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-[#f1f3f4] rounded-2xl shadow-xl overflow-hidden">
                          <SelectItem value="founder">Founder</SelectItem>
                          <SelectItem value="co-founder">Co-Founder</SelectItem>
                          <SelectItem value="ceo">CEO</SelectItem>
                          <SelectItem value="cmo">CMO</SelectItem>
                          <SelectItem value="marketing-director">Marketing Director</SelectItem>
                          <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Submit button */}
                    <Button 
                      type="submit"
                      className="w-full h-[50px] bg-[#d266a3] hover:bg-[#c15594] rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                      Submit
                    </Button>
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