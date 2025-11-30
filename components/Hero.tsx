
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowLeft, ArrowRight, Sparkles, Layout, Video, Palette, Share2, Mic } from 'lucide-react';
import { BannerCarousel } from './BannerCarousel';
import { Language, ProjectType, Banner } from '../types';
import { requestService } from '../services/mockDb';

interface HeroProps {
  onStart: () => void;
  onServiceClick: (type: ProjectType) => void;
  t: any;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({ onStart, onServiceClick, t, language }) => {
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;
  const [activeCard, setActiveCard] = useState<number | null>(null);
  
  // State for Banners in the Hero Frame
  const [heroBanners, setHeroBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Fetch Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await requestService.getBanners(true);
        setHeroBanners(data);
      } catch (error) {
        console.error("Error fetching banners for hero:", error);
      }
    };
    fetchBanners();
  }, []);

  // Slideshow Logic (Smooth Cross-fade)
  useEffect(() => {
    if (heroBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [heroBanners]);

  const handleCardClick = (index: number, type: ProjectType) => {
    setActiveCard(index);
    // Delay navigation to allow the 3D animation to play
    setTimeout(() => {
      onServiceClick(type);
      // Reset state (optional as component might unmount, but good practice)
      setTimeout(() => setActiveCard(null), 100);
    }, 400);
  };

  const services = [
    {
      id: 0,
      type: ProjectType.VOICE_AGENCIES,
      title: t.srvVoice,
      desc: t.srvVoiceDesc,
      icon: <Mic size={28} />,
      colorClass: 'rose',
      shadowColor: 'rgba(244,63,94,0.6)', // Rose 500
      solidColor: '#f43f5e'
    },
    {
      id: 1,
      type: ProjectType.BRANDING,
      title: t.srvBranding,
      desc: t.srvBrandingDesc,
      icon: <Palette size={28} />,
      colorClass: 'indigo',
      shadowColor: 'rgba(99,102,241,0.6)', // Indigo 500
      solidColor: '#6366f1'
    },
    {
      id: 2,
      type: ProjectType.WEB_DESIGN,
      title: t.srvUi,
      desc: t.srvUiDesc,
      icon: <Layout size={28} />,
      colorClass: 'pink',
      shadowColor: 'rgba(236,72,153,0.6)', // Pink 500
      solidColor: '#ec4899'
    },
    {
      id: 3,
      type: ProjectType.SOCIAL_MEDIA,
      title: t.srvSocial,
      desc: t.srvSocialDesc,
      icon: <Share2 size={28} />,
      colorClass: 'cyan',
      shadowColor: 'rgba(6,182,212,0.6)', // Cyan 500
      solidColor: '#06b6d4'
    },
    {
      id: 4,
      type: ProjectType.VIDEO_EDITING,
      title: t.srvMotion,
      desc: t.srvMotionDesc,
      icon: <Video size={28} />,
      colorClass: 'purple',
      shadowColor: 'rgba(168,85,247,0.6)', // Purple 500
      solidColor: '#a855f7'
    }
  ];

  // Helper to map color names to tailwind classes dynamically
  const getColorClasses = (color: string) => {
    const map: Record<string, { bg: string, text: string, border: string, solidBg: string }> = {
      rose: { bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-500 dark:text-rose-400', border: 'border-rose-500/50', solidBg: 'bg-rose-500' },
      indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-500 dark:text-indigo-400', border: 'border-indigo-500/50', solidBg: 'bg-indigo-500' },
      pink: { bg: 'bg-pink-500/10 dark:bg-pink-500/20', text: 'text-pink-500 dark:text-pink-400', border: 'border-pink-500/50', solidBg: 'bg-pink-500' },
      cyan: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', text: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-500/50', solidBg: 'bg-cyan-500' },
      purple: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-500 dark:text-purple-400', border: 'border-purple-500/50', solidBg: 'bg-purple-500' },
    };
    return map[color] || map.indigo;
  };

  return (
    <div className="relative overflow-hidden pt-10 pb-20 min-h-[calc(100vh-80px)] flex flex-col justify-center">
      
      {/* 5D Ambient Background Effects */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-float-delayed opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center mb-12">
          
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-200 px-5 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in-up hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-default shadow-[0_0_20px_rgba(129,140,248,0.2)]">
            <Sparkles size={16} className="text-yellow-500 dark:text-yellow-300 animate-pulse" />
            <span>{t.badge}</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 w-full">
            
            {/* Top Content: Text & Buttons */}
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight drop-shadow-2xl">
                <span className="block text-2xl md:text-3xl font-medium text-slate-500 dark:text-indigo-300 mb-2">{t.titleStart}</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-secondary animate-pulse-glow">
                  {t.titleEnd}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                {t.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={onStart}
                  className="!px-8 !py-4 text-lg shadow-[0_0_30px_rgba(129,140,248,0.4)] hover:shadow-[0_0_50px_rgba(129,140,248,0.6)] hover:scale-105 transition-transform"
                  variant="primary"
                  icon={<Arrow size={20} />}
                >
                  {t.btnStart}
                </Button>
                <Button 
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  variant="glass"
                  className="!px-8 !py-4 text-lg hover:bg-white/10 dark:hover:bg-white/20"
                >
                  {t.btnExplore}
                </Button>
              </div>
            </div>

            {/* Bottom Content: Floating Glass Frame (Specific System Online Design) */}
            {/* This frame now displays images from the Admin Banners system */}
            <div className="relative w-full max-w-sm mt-8 mb-8 animate-float">
               <div className="bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl relative overflow-hidden group">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-black/50">
                     
                     {/* Multiple Banners Cross-fade */}
                     {heroBanners.length > 0 ? (
                        heroBanners.map((banner, index) => (
                          <img 
                            key={banner.id}
                            src={banner.imageUrl} 
                            alt="System Preview" 
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                              index === currentBannerIndex 
                                ? 'opacity-100 scale-100 z-10' 
                                : 'opacity-0 scale-110 z-0'
                            }`}
                          />
                        ))
                     ) : (
                        <img 
                          src="https://i.ibb.co/xSw4nC6h/35495.jpg"
                          alt="Default Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
                          }}
                        />
                     )}

                     {/* Overlay Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none"></div>
                     
                     {/* System UI Overlay */}
                     <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
                        <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden mr-4">
                           <div className="h-full w-2/3 bg-indigo-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono text-white/80 tracking-widest">SYSTEM ONLINE</span>
                           <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
               </div>
               
               {/* Ambient Glow Behind Card */}
               <div className="absolute -inset-4 bg-indigo-600/20 blur-3xl rounded-full -z-10 animate-pulse-slow"></div>
            </div>

            {/* Banner Carousel - Also displaying below as requested in previous steps (can be removed if redundant) */}
            <BannerCarousel emptyMsg={t.noBanners} />

          </div>
        </div>

        {/* Services Grid with 3D Interaction */}
        <div className="mt-20 relative z-10" id="services">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-800 dark:text-white mb-4 drop-shadow-xl">{t.servicesTitle}</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-16 text-lg">{t.servicesDesc}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {services.map((service, idx) => {
              const colors = getColorClasses(service.colorClass);
              const isActive = activeCard === idx;
              
              return (
                <div 
                  key={service.id}
                  onClick={() => handleCardClick(idx, service.type)}
                  className={`relative group h-full cursor-pointer transition-all duration-500 ease-out transform-style-3d`}
                  style={{ 
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                    transform: isActive ? 'rotateX(10deg) scale(0.95)' : 'none',
                    zIndex: isActive ? 50 : 10
                  }}
                >
                   {/* Specific Color Backlight Glow (Only visible on hover/active) */}
                   <div 
                     className={`absolute inset-4 rounded-3xl blur-[40px] transition-all duration-500 opacity-0 group-hover:opacity-40 ${colors.solidBg} ${isActive ? '!opacity-60 scale-110' : ''}`}
                     style={{ zIndex: -1 }}
                   ></div>

                  <div 
                    className={`
                      relative h-full bg-white/70 dark:bg-[#1e293b]/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 
                      p-8 rounded-3xl overflow-hidden transition-all duration-300
                      ${isActive ? 'border-transparent' : colors.border}
                    `}
                    style={{
                      boxShadow: isActive 
                        ? `0 0 50px ${service.shadowColor}, inset 0 0 20px ${service.shadowColor}` 
                        : 'none'
                    }}
                  >
                    
                    {/* Inner active border glow */}
                    <div className={`absolute inset-0 rounded-3xl border-2 opacity-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`} style={{ borderColor: service.solidColor }}></div>

                    {/* Icon Container with Glow */}
                    <div 
                       className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-inner group-hover:scale-110 relative z-10`}
                       style={{
                         boxShadow: isActive ? `0 0 20px ${service.solidColor}` : 'none',
                         backgroundColor: isActive ? service.solidColor : undefined,
                         color: isActive ? '#fff' : undefined
                       }}
                    >
                      <span className={`${isActive ? 'text-white' : colors.text} transition-colors duration-300 drop-shadow-sm`}>
                         {service.icon}
                      </span>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 transition-colors ${isActive ? 'text-white' : 'text-slate-800 dark:text-white group-hover:text-primary'}`}>
                       {service.title}
                    </h3>
                    <p className={`leading-relaxed text-sm transition-colors ${isActive ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                      {service.desc}
                    </p>
                    
                    <div className={`mt-6 flex items-center text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
                      <span className="rtl:ml-2 ltr:mr-2">{t.btnRequest}</span>
                      <Arrow size={16} className={`rtl:rotate-0 ltr:rotate-0 transition-transform ${isActive ? 'translate-x-1 rtl:-translate-x-1' : 'group-hover:translate-x-1 rtl:group-hover:-translate-x-1'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
