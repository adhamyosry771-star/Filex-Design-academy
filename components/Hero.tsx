
import React from 'react';
import { Button } from './Button';
import { ArrowLeft, Sparkles, Layout, PenTool, Video, Palette, Share2, Mic } from 'lucide-react';
import { BannerCarousel } from './BannerCarousel';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden pt-10 pb-20 min-h-[calc(100vh-80px)] flex flex-col justify-center">
      
      {/* 5D Ambient Background Effects */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-float-delayed opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center mb-12">
          
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-indigo-200 px-5 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in-up hover:bg-white/10 transition-colors cursor-default shadow-[0_0_20px_rgba(129,140,248,0.2)]">
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
            <span className="tracking-wide">تصاميم من عالم آخر مدعومة بالذكاء الاصطناعي</span>
          </div>
          
          {/* Intro Text */}
          <p className="text-xl md:text-3xl text-slate-200 mb-10 leading-relaxed max-w-3xl mx-auto font-light drop-shadow-xl">
            مرحباً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold">أكاديمية فليكس</span>. نأخذ أفكارك إلى بُعد جديد حيث يلتقي الفن بالتكنولوجيا لنخلق لك تجربة بصرية تسحر العيون.
          </p>

          {/* Raised Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 w-full sm:w-auto">
            <Button onClick={onStart} className="w-full sm:w-auto text-lg px-12 py-4 shadow-[0_0_30px_rgba(129,140,248,0.4)] hover:shadow-[0_0_50px_rgba(129,140,248,0.6)] transition-shadow duration-500 rounded-2xl">
              ابدأ رحلتك الآن
              <ArrowLeft className="mr-2" size={20} />
            </Button>
            <Button variant="glass" className="w-full sm:w-auto text-lg px-12 py-4 rounded-2xl">
              استكشف المجرات
            </Button>
          </div>

          {/* Floating Glass Frame Image */}
          <div className="relative animate-float max-w-4xl w-full mb-10">
             {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-purple-500 to-secondary opacity-20 blur-[60px] -z-10 rounded-full" />
            
            <div className="bg-white/5 backdrop-blur-md border border-white/20 p-3 rounded-[2rem] shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="relative overflow-hidden rounded-[1.5rem] aspect-video bg-black/20">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="Cosmic Abstract Art" 
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-40"></div>
                
                {/* Overlay Text inside image */}
                <div className="absolute bottom-6 right-6 text-right">
                  <div className="text-white/80 text-sm font-mono">SYSTEM_STATUS: ONLINE</div>
                  <div className="text-white font-bold text-xl tracking-wider">DIMENSION_05</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Banners Section */}
        <BannerCarousel />
        
        {/* Services Section */}
        <div className="mt-12 pt-12 border-t border-white/5 w-full animate-fade-in-up delay-200">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              خدماتنا الإبداعية
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              في فليكس ديزاين، لا نقدم مجرد تصاميم، بل نصنع تجارب بصرية متكاملة تروي قصة علامتك التجارية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* New Card: Voice Agencies */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden lg:col-span-1 border-t-4 border-t-rose-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <Mic size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">وكالات وبرامج صوتية</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                نصمم شعارات الوكالات، إطارات الإدارات، وشارات التميز لجميع برامج الدردشة الصوتية باحترافية وأفكار حصرية.
              </p>
            </div>

            {/* Card 1: Branding */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Palette size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">هوية بصرية وشعارات</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                نصمم شعارات فريدة وهويات بصرية متكاملة تعكس جوهر علامتك التجارية وترسخ في أذهان عملائك.
              </p>
            </div>
            
            {/* Card 2: UI/UX */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                <Layout size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">واجهات وتجربة مستخدم</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                نصمم واجهات مواقع وتطبيقات تجمع بين الجمالية وسهولة الاستخدام لتوفير تجربة رقمية استثنائية.
              </p>
            </div>

            {/* Card 3: Social Media */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Share2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">تصاميم سوشيال ميديا</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                نبتكر محتوى بصري جذاب لمنصات التواصل الاجتماعي يساعد في زيادة التفاعل والوصول لجمهورك.
              </p>
            </div>

            {/* Card 4: Motion Graphics */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Video size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">موشن جرافيك ومونتاج</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                نحول الأفكار الجامدة إلى فيديوهات متحركة مبهرة توصل رسالتك بشكل ديناميكي ومؤثر.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
