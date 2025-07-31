'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Bitcoin, TrendingUp, DollarSign, Users, CheckCircle, Twitter, Globe, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

const TypewriterInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  isActive: boolean;
}> = ({ value, onChange, onFocus, isActive }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  const prompts = [
    'tech review creators in San Francisco with more than 100k followers',
    'crypto influencers who focus on DeFi and have high engagement rates',
    'finance creators who make educational content about investing',
    'trading experts with audiences interested in forex and stocks'
  ];

  useEffect(() => {
    if (value.trim() || isUserTyping) return; // Don't animate if user has actually typed content
    
    const typeText = async () => {
      setIsTyping(true);
      const currentPrompt = prompts[currentPromptIndex];
      
      // Type out the text
      for (let i = 0; i <= currentPrompt.length; i++) {
        if (value.trim() || isUserTyping) return; // Stop if user starts typing
        setDisplayText('Find me ' + currentPrompt.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Wait before deleting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Delete back to "Find me "
      for (let i = currentPrompt.length; i >= 0; i--) {
        if (value.trim() || isUserTyping) return; // Stop if user starts typing
        setDisplayText('Find me ' + currentPrompt.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
      setIsTyping(false);
    };
    
    typeText();
  }, [currentPromptIndex, value, isUserTyping]);

  const handleInputChange = (newValue: string) => {
    setIsUserTyping(true);
    onChange(newValue);
  };

  const handleFocus = () => {
    setIsUserTyping(true);
    onFocus();
  };
  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[56px] px-5 py-3 w-full">
        <Sparkles className="w-5 h-5 text-purple-500 mr-4 flex-shrink-0" />
        <div className="flex-1 min-h-[24px] w-full flex items-center">
          {isUserTyping || value.trim() ? (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
              placeholder="Find me "
              className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-400 text-base leading-6 min-h-[24px] max-h-[120px] overflow-y-auto block py-1"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '24px',
                maxHeight: '120px',
                width: '100%',
                wordWrap: 'break-word'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                const newHeight = Math.min(target.scrollHeight, 120);
                target.style.height = newHeight + 'px';
              }}
              autoFocus={isUserTyping}
            />
          ) : (
            <div 
              className="text-gray-700 text-base leading-6 cursor-text min-h-[24px] whitespace-pre-wrap w-full block py-1"
              onClick={handleFocus}
            >
              {displayText}
              {isTyping && <span className="animate-pulse">|</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text-center">
      <motion.div 
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="w-20 h-20 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl"
      >
        <img 
          src="/buzzberry icon gradient.png" 
          alt="Buzzberry" 
          className="w-12 h-12 object-contain"
        />
      </motion.div>
    </div>
  );
};

interface FormData {
  niche: string;
  website: string;
  creatorDescription: string;
  audienceSize: string;
}

const OnboardingFlow: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    niche: '',
    website: '',
    creatorDescription: '',
    audienceSize: ''
  });

  const totalSteps = 6;

  const niches = [
    { 
      name: 'Cryptocurrency', 
      icon: Bitcoin, 
      description: 'Digital assets, blockchain, DeFi',
      gradient: 'from-orange-400 to-yellow-500'
    },
    { 
      name: 'Trading', 
      icon: TrendingUp, 
      description: 'Forex, stocks, technical analysis',
      gradient: 'from-green-400 to-emerald-500'
    },
    { 
      name: 'Personal Finance', 
      icon: DollarSign, 
      description: 'Budgeting, investing, wealth building',
      gradient: 'from-blue-400 to-cyan-500'
    }
  ];

  const creatorTypes = [
    { 
      name: 'Micro Creators', 
      range: '10K-50K', 
      desc: 'High engagement, authentic connections',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Growing Creators', 
      range: '50K-150K', 
      desc: 'Expanding reach, proven content',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Top Creators', 
      range: '150K-350K', 
      desc: 'Maximum reach, industry leaders',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      name: 'Best Match', 
      range: '10K-350K', 
      desc: 'AI-selected optimal creators',
      icon: Sparkles,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleNext = () => {
    if (currentStep === 2 && formData.website) {
      setCurrentStep(currentStep + 1);
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewMatches = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save onboarding data to Supabase
        const { error } = await supabase
          .from('onboarding_data')
          .upsert({
            user_id: user.id,
            niche: formData.niche,
            website: formData.website,
            creator_description: formData.creatorDescription,
            audience_size: formData.audienceSize,
            completed_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving onboarding data:', error);
        }
      }

      setIsExiting(true);
      
      // Navigate to dashboard after animation
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      console.error('Error in handleViewMatches:', error);
      // Still navigate even if there's an error
      setIsExiting(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }
  };

  // Prevent form submission on Enter key to avoid page refresh
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isStepValid()) {
        handleNext();
      }
    }
  };
  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.niche !== '';
      case 2: return formData.website !== '' && formData.website.includes('.');
      case 3: return formData.creatorDescription.trim() !== '';
      default: return true;
    }
  };

  const ProgressDots = () => (
    <div className="flex justify-center space-x-2 mt-6 pb-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={{ 
            scale: index === currentStep ? 1 : 0.8,
            opacity: 1,
            backgroundColor: index === currentStep ? '#000000' : '#9CA3AF'
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full"
        />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center px-4 sm:px-6 flex flex-col justify-center h-full"
          >
            {logoAnimationComplete && (
              <motion.div 
                initial={{ y: -100, scale: 1.5, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 120,
                  damping: 20
                }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-xl"
              >
                <img 
                  src="/buzzberry icon gradient.png" 
                  alt="Buzzberry" 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </motion.div>
            )}
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: logoAnimationComplete ? 1 : 0, y: logoAnimationComplete ? 0 : 30 }}
              transition={{ delay: logoAnimationComplete ? 0.3 : 0, duration: 0.6 }}
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3"
            >
              Welcome to Buzzberry
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: logoAnimationComplete ? 1 : 0, y: logoAnimationComplete ? 0 : 30 }}
              transition={{ delay: logoAnimationComplete ? 0.5 : 0, duration: 0.6 }}
              className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xs mx-auto"
            >
              AI-powered influencer matching for crypto, trading & finance brands.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: logoAnimationComplete ? 1 : 0, y: logoAnimationComplete ? 0 : 30 }}
              transition={{ delay: logoAnimationComplete ? 0.7 : 0, duration: 0.6 }}
            >
              <Button 
                onClick={handleNext} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="px-4 sm:px-8 flex flex-col justify-center h-full py-4 sm:py-6"
          >
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Select your niche</h2>
              <p className="text-gray-600 text-xs sm:text-sm">Our AI will find creators in your specific market</p>
            </div>
            
            <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6 flex-1 flex flex-col justify-center">
              {niches.map((niche) => {
                const IconComponent = niche.icon;
                return (
                  <Card
                    key={niche.name}
                    onClick={() => handleInputChange('niche', niche.name)}
                    className={cn(
                      "p-2.5 sm:p-3 cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                      formData.niche === niche.name 
                        ? `bg-gradient-to-r ${niche.gradient} text-white shadow-lg border-transparent` 
                        : "bg-white/80 hover:bg-white/90 text-gray-700 border-gray-200"
                    )}
                  >
                    <div className="flex items-center space-x-2.5 sm:space-x-3">
                      <div className={cn(
                        "w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center",
                        formData.niche === niche.name ? "bg-white/20" : "bg-gray-100"
                      )}>
                        <IconComponent className={cn(
                          "w-3.5 h-3.5 sm:w-4 sm:h-4",
                          formData.niche === niche.name ? "text-white" : "text-gray-600"
                        )} />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-xs sm:text-sm">{niche.name}</h3>
                        <p className={cn(
                          "text-xs sm:text-xs leading-tight",
                          formData.niche === niche.name ? "text-white/80" : "text-gray-500"
                        )}>
                          {niche.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 w-full"
            >
              Continue
            </Button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="px-4 sm:px-8 flex flex-col justify-center h-full"
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">What's your website</h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">We'll analyze your brand for better matching</p>
            </div>
            
            <div className="mb-8 sm:mb-12 flex items-center justify-center">
              <Input
                type="url"
                placeholder="www.vibemarketing.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="text-center text-sm sm:text-base w-full max-w-sm"
              />
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 w-full"
            >
              Continue
            </Button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="px-6 sm:px-8 flex flex-col h-full"
          >
            <div className="text-center mb-8 sm:mb-12 mt-8 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Describe your perfect creator</h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">Tell our AI what type of creator you're looking for</p>
            </div>
            
            <div className="mb-8 sm:mb-12 flex-1 flex items-center justify-center px-2">
              <TypewriterInput
                value={formData.creatorDescription}
                onChange={(value) => handleInputChange('creatorDescription', value)}
                onFocus={() => setIsSearchActive(true)}
                isActive={isSearchActive}
              />
            </div>
            
            <div className="pb-4">
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 w-full"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="px-4 sm:px-6 flex flex-col justify-center h-full py-2"
          >
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Choose creator size</h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">Select the audience size that fits your campaign</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3 sm:mb-4 flex-1 max-h-[280px] sm:max-h-[320px]">
              {creatorTypes.map((type) => (
                <Card
                  key={type.name}
                  onClick={() => handleInputChange('audienceSize', type.name)}
                  className={cn(
                    "p-2.5 sm:p-3 cursor-pointer transition-all duration-300 hover:scale-[1.02] h-full flex flex-col justify-between min-h-[110px] sm:min-h-[130px] relative overflow-hidden",
                    formData.audienceSize === type.name
                      ? `bg-gradient-to-br ${type.gradient} text-white shadow-xl border-transparent` 
                      : "bg-white/90 hover:bg-white text-gray-700 border-gray-200/50 shadow-md hover:shadow-lg"
                  )}
                >
                  {/* Background pattern */}
                  <div className={cn(
                     "absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 opacity-10",
                    formData.audienceSize === type.name ? "opacity-20" : ""
                  )}>
                    {React.createElement(type.icon, { className: "w-full h-full" })}
                  </div>
                  
                  <div className="relative z-10">
                    <div className={cn(
                       "w-5 h-5 sm:w-6 sm:h-6 rounded-md mb-1 sm:mb-2 flex items-center justify-center",
                      formData.audienceSize === type.name 
                        ? "bg-white/20" 
                        : "bg-gray-100"
                    )}>
                      {React.createElement(type.icon, { 
                        className: cn(
                           "w-2.5 h-2.5 sm:w-3 sm:h-3",
                          formData.audienceSize === type.name ? "text-white" : "text-gray-600"
                        )
                      })}
                    </div>
                     <h3 className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight">{type.name}</h3>
                    <p className={cn(
                       "font-semibold text-sm sm:text-base mb-0.5 sm:mb-1",
                      formData.audienceSize === type.name ? "text-white/90" : "text-purple-600"
                    )}>{type.range}</p>
                    <p className={cn(
                       "text-xs leading-tight",
                      formData.audienceSize === type.name ? "text-white/70" : "text-gray-500"
                    )}>{type.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!formData.audienceSize}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 w-full"
            >
              Continue
            </Button>
          </motion.div>
        );

      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center px-3 sm:px-6 flex flex-col justify-center h-full"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl mx-auto mb-4 sm:mb-8 flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6"
            >
              Perfect! You're all set
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 leading-relaxed max-w-[240px] sm:max-w-[280px] mx-auto text-center"
            >
              Finding perfect {formData.niche.toLowerCase()} creators for your brand.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col gap-2.5 sm:gap-4"
            >
              <Button
                onClick={handleViewMatches}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Matches
              </Button>
              <Button
                onClick={() => window.open('https://twitter.com/buzzberry', '_blank')}
                variant="secondary"
                className="text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-white/80 hover:bg-white/90 border border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Follow us on X
              </Button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Blurred Background Dashboard */}
      <motion.div 
        className="absolute inset-0 blur-sm"
        initial={{ opacity: 0.1 }}
        animate={{ 
          opacity: isExiting ? 1 : 0.1,
          filter: isExiting ? 'blur(0px)' : 'blur(4px)'
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="h-full bg-gray-50">
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Card */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            className="relative z-10 min-h-screen flex items-center justify-center p-4"
            exit={{ 
              opacity: 0,
              scale: 0.8,
              y: 50
            }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-b from-purple-300 via-purple-300 via-30% to-white rounded-[2.5rem] shadow-2xl w-full max-w-[380px] sm:max-w-[480px] h-[520px] sm:h-[560px] max-h-[95vh] relative backdrop-blur-sm border border-white/20 flex flex-col mx-2 sm:mx-4 overflow-hidden"
          onAnimationComplete={() => {
            setTimeout(() => setLogoAnimationComplete(true), 100);
          }}
        >
          {/* Back Button */}
          {currentStep > 0 && currentStep < totalSteps - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleBack}
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          {/* Step Content */}
          <div className="flex-1 flex flex-col justify-center p-3 sm:p-6 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col justify-center min-h-0"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots at Bottom */}
          <div className="pb-1 sm:pb-6 flex-shrink-0">
            <ProgressDots />
          </div>
        </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;