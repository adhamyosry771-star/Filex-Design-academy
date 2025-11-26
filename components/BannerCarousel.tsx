
import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../types';
import { requestService } from '../services/mockDb';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const BannerCarousel: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await requestService.getBanners(true);
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (banners.length <= 1) return;
    
    startTimer();
    return () => stopTimer();
  }, [currentIndex, banners.length]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    stopTimer();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset and restart timer
    setTouchStart(0);
    setTouchEnd(0);
    startTimer();
  };

  if (banners.length === 0) return null;

  return (
    <div 
      className="w-full max-w-2xl mx-auto mt-12 mb-8 relative z-20 animate-fade-in-up"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* Glow Effect Behind */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-30 blur-xl animate-pulse-slow"></div>

      <div 
        className="relative aspect-[21/9] md:aspect-[3/1] rounded-[1.5rem] overflow-hidden border border-white/20 shadow-2xl bg-white/5 backdrop-blur-md group touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              index === currentIndex 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
            }`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Gradient Overlay for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md translate-y-0 transition-transform duration-500">
                {banner.title}
              </h3>
              {/* Progress Line Indicator (Optional visual flair) */}
              <div className={`h-1 bg-primary mt-3 rounded-full transition-all duration-[5000ms] ease-linear ${index === currentIndex ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}></div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows (Hidden on touch devices usually, shown on hover/desktop) */}
        {banners.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots Indicators */}
        <div className="absolute bottom-3 right-6 flex gap-1.5 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentIndex(idx); startTimer(); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
