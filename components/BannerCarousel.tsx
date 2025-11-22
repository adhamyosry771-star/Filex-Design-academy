
import React, { useState, useEffect } from 'react';
import { Banner } from '../types';
import { requestService } from '../services/mockDb';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const BannerCarousel: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    
    // Optional: Poll for updates every 10 seconds to see new banners without refresh
    const pollInterval = setInterval(fetchBanners, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-20 mb-10 relative z-10 animate-fade-in-up">
      <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(129,140,248,0.15)] group">
        {/* Glass Overlay Frame */}
        <div className="absolute inset-0 border-[1px] border-white/20 rounded-3xl z-20 pointer-events-none bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform translate-y-0 transition-transform duration-500">
              <h3 className="text-3xl font-bold text-white drop-shadow-lg mb-2">{banner.title}</h3>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>
          </div>
        ))}

        {/* Controls */}
        {banners.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
