import React, { useRef, useEffect, useState } from 'react';

interface MobileVideoBackgroundProps {
  className?: string;
}

// Mobile-specific video element
let mobileVideo: HTMLVideoElement | null = null;
let mobileVideoInitialized = false;
let mobileVideoReady = false;

const createMobileVideo = () => {
  if (mobileVideo) return mobileVideo;

  console.log('📱 Creating mobile-specific video element');
  
  mobileVideo = document.createElement('video');
  mobileVideo.src = "/BuzzBerry Social Media video.mp4";
  mobileVideo.muted = true;
  mobileVideo.playsInline = true;
  mobileVideo.autoplay = true;
  mobileVideo.loop = true;
  mobileVideo.controls = false;
  mobileVideo.preload = 'auto';
  
  // Mobile-specific attributes
  mobileVideo.setAttribute('webkit-playsinline', 'true');
  mobileVideo.setAttribute('playsinline', 'true');
  mobileVideo.setAttribute('muted', 'true');
  mobileVideo.setAttribute('x-webkit-airplay', 'allow');
  
  // Mobile-optimized styling
  mobileVideo.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    z-index: 1 !important;
    display: block !important;
    background: #000 !important;
  `;

  // Mobile-specific event handlers
  mobileVideo.addEventListener('loadeddata', () => {
    console.log('📱 Mobile video loaded data');
    mobileVideoReady = true;
    
    if (!mobileVideoInitialized) {
      // Try to play immediately
      const playPromise = mobileVideo?.play();
      
      if (playPromise) {
        playPromise.then(() => {
          console.log('📱 Mobile video started playing');
          mobileVideoInitialized = true;
        }).catch(error => {
          console.log('📱 Mobile autoplay prevented, setting up interaction handlers:', error);
          
          // Multiple interaction handlers for mobile
          const playOnInteraction = (event: Event) => {
            console.log('📱 User interaction detected:', event.type);
            
            if (mobileVideo && mobileVideo.paused) {
              const playAttempt = mobileVideo.play();
              
              if (playAttempt) {
                playAttempt.then(() => {
                  console.log('📱 Mobile video playing after interaction');
                  mobileVideoInitialized = true;
                  removeInteractionListeners();
                }).catch(e => {
                  console.log('📱 Mobile play failed after interaction:', e);
                });
              }
            }
          };
          
          const removeInteractionListeners = () => {
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('touchend', playOnInteraction);
            document.removeEventListener('scroll', playOnInteraction);
          };
          
          // Add multiple interaction listeners for mobile
          document.addEventListener('click', playOnInteraction, { passive: true });
          document.addEventListener('touchstart', playOnInteraction, { passive: true });
          document.addEventListener('touchend', playOnInteraction, { passive: true });
          document.addEventListener('scroll', playOnInteraction, { passive: true, once: true });
        });
      }
    }
  });

  mobileVideo.addEventListener('loadedmetadata', () => {
    console.log('📱 Mobile video metadata loaded');
  });

  mobileVideo.addEventListener('canplay', () => {
    console.log('📱 Mobile video can play');
    if (mobileVideo?.paused && mobileVideoReady) {
      mobileVideo.play().catch(e => console.log('📱 Mobile canplay play failed:', e));
    }
  });

  mobileVideo.addEventListener('canplaythrough', () => {
    console.log('📱 Mobile video can play through');
  });

  mobileVideo.addEventListener('error', (e) => {
    console.error('📱 Mobile video error:', e);
    if (mobileVideo?.error) {
      console.error('📱 Mobile error details:', {
        code: mobileVideo.error.code,
        message: mobileVideo.error.message
      });
    }
  });

  // Keep mobile video playing
  mobileVideo.addEventListener('pause', () => {
    console.log('📱 Mobile video paused, attempting to resume');
    setTimeout(() => {
      if (mobileVideo && mobileVideo.paused && !mobileVideo.ended && mobileVideoReady) {
        mobileVideo.play().catch(e => console.log('📱 Mobile resume failed:', e));
      }
    }, 100);
  });

  mobileVideo.addEventListener('ended', () => {
    console.log('📱 Mobile video ended, restarting');
    if (mobileVideo) {
      mobileVideo.currentTime = 0;
      mobileVideo.play().catch(e => console.log('📱 Mobile restart failed:', e));
    }
  });

  // Handle mobile-specific visibility changes
  const handleMobileVisibilityChange = () => {
    if (!document.hidden && mobileVideo?.paused && mobileVideoReady) {
      console.log('📱 Mobile page visible, resuming video');
      mobileVideo.play().catch(e => console.log('📱 Mobile resume on visibility failed:', e));
    }
  };
  
  document.addEventListener('visibilitychange', handleMobileVisibilityChange);

  // Handle mobile orientation changes
  const handleOrientationChange = () => {
    console.log('📱 Mobile orientation changed');
    setTimeout(() => {
      if (mobileVideo && mobileVideo.paused && mobileVideoReady) {
        mobileVideo.play().catch(e => console.log('📱 Mobile orientation play failed:', e));
      }
    }, 500);
  };
  
  window.addEventListener('orientationchange', handleOrientationChange);

  // Start loading
  console.log('📱 Starting mobile video load');
  mobileVideo.load();
  
  return mobileVideo;
};

export const MobileVideoBackground: React.FC<MobileVideoBackgroundProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    ready: false,
    initialized: false,
    playing: false,
    currentTime: 0
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    console.log('📱 MobileVideoBackground component mounted');

    // Get or create the mobile video
    const video = createMobileVideo();
    
    // Clear container and add video
    container.innerHTML = '';
    container.appendChild(video);

    // Update debug info
    const updateDebugInfo = () => {
      if (video) {
        setDebugInfo({
          ready: mobileVideoReady,
          initialized: mobileVideoInitialized,
          playing: !video.paused,
          currentTime: video.currentTime
        });
      }
    };

    // Check if video is already ready
    if (mobileVideoReady) {
      setIsVideoVisible(true);
      if (video.paused && mobileVideoInitialized) {
        video.play().catch(e => console.log('📱 Mobile resume play failed:', e));
      }
    }

    // Listen for video ready state
    const checkVideoReady = () => {
      if (mobileVideoReady) {
        setIsVideoVisible(true);
      }
      updateDebugInfo();
    };

    const interval = setInterval(checkVideoReady, 500);

    // Cleanup
    return () => {
      clearInterval(interval);
      console.log('📱 MobileVideoBackground component unmounting');
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Debug info for mobile */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          zIndex: 10,
          fontFamily: 'monospace',
          lineHeight: '1.3'
        }}>
          <div>📱 MOBILE VIDEO</div>
          <div>Ready: {debugInfo.ready ? '✅' : '⏳'}</div>
          <div>Init: {debugInfo.initialized ? '✅' : '❌'}</div>
          <div>Playing: {debugInfo.playing ? '▶️' : '⏸️'}</div>
          <div>Time: {debugInfo.currentTime.toFixed(1)}s</div>
          <div>Visible: {isVideoVisible ? '👁️' : '🙈'}</div>
        </div>
      )}
    </div>
  );
};

// Cleanup function for mobile video
export const cleanupMobileVideo = () => {
  if (mobileVideo) {
    console.log('📱 Cleaning up mobile video');
    mobileVideo.pause();
    mobileVideo.removeAttribute('src');
    mobileVideo.load();
    mobileVideo = null;
    mobileVideoInitialized = false;
    mobileVideoReady = false;
  }
};