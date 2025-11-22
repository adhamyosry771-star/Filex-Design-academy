
import React, { useState } from 'react';
import { Palette, Menu, LogIn, User as UserIcon, LogOut, X, LayoutDashboard, Phone, Home, PenTool, ShieldCheck } from 'lucide-react';
import { PageView, User } from '../types';
import { Button } from './Button';

interface NavbarProps {
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = (page: PageView) => 
    `text-sm font-medium transition-colors relative hover:text-white ${currentPage === page ? 'text-white after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-primary after:shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'text-slate-400'}`;

  const handleNavigate = (page: PageView) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group relative z-50"
            onClick={() => handleNavigate('HOME')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(129,140,248,0.5)] group-hover:scale-105 transition-transform duration-300 border border-white/20">
              <Palette size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              Flex<span className="text-primary">Design</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavigate('HOME')} className={navLinkClass('HOME')}>
              الرئيسية
            </button>
            
            <button onClick={() => handleNavigate('CONTACT')} className={navLinkClass('CONTACT')}>
              اتصل بنا
            </button>
            
            {!user && (
              <button
                onClick={() => handleNavigate('REQUEST_FORM')}
                className={navLinkClass('REQUEST_FORM')}
              >
                طلب تصميم
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
                {user.role === 'ADMIN' && (
                  <button 
                    onClick={() => handleNavigate('ADMIN_DASHBOARD')}
                    className={`flex items-center gap-2 text-sm font-bold transition-all px-3 py-1.5 rounded-lg ${currentPage === 'ADMIN_DASHBOARD' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'}`}
                  >
                    <ShieldCheck size={16} />
                    <span>لوحة المدير</span>
                  </button>
                )}

                <button 
                  onClick={() => handleNavigate('DASHBOARD')}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentPage === 'DASHBOARD' ? 'text-primary' : 'text-slate-300 hover:text-white'}`}
                >
                  <UserIcon size={18} />
                  <span>{user.name}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut size={18} />
                </button>
                <Button
                  onClick={() => handleNavigate('REQUEST_FORM')}
                  className="!px-4 !py-2 text-sm ml-2"
                  variant="glass"
                >
                  طلب جديد
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
                <button 
                  onClick={() => handleNavigate('LOGIN')}
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  دخول
                </button>
                <Button 
                  onClick={() => handleNavigate('REGISTER')}
                  className="!px-4 !py-2 text-sm"
                  variant="primary"
                  icon={<LogIn size={16} />}
                >
                  تسجيل
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative z-50">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0f172a]/95 backdrop-blur-2xl pt-24 px-6 animate-fade-in h-screen overflow-y-auto">
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {user && (
              <div className="bg-white/5 rounded-2xl p-6 mb-4 border border-white/10 flex items-center gap-4 shadow-lg">
                 <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <UserIcon size={24} />
                 </div>
                 <div className="flex-1">
                    <div className="text-white font-bold text-lg flex items-center gap-2">
                      {user.name}
                      {user.role === 'ADMIN' && <ShieldCheck size={16} className="text-amber-500" />}
                    </div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                 </div>
              </div>
            )}

            <div className="space-y-2">
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={() => handleNavigate('ADMIN_DASHBOARD')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border mb-2 ${currentPage === 'ADMIN_DASHBOARD' ? 'bg-amber-500 text-white border-amber-600' : 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'}`}
                >
                  <ShieldCheck size={22} />
                  <span className="text-lg font-bold">لوحة تحكم المدير</span>
                </button>
              )}

              <button 
                onClick={() => handleNavigate('HOME')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'HOME' ? 'bg-primary/20 text-white border-primary/30' : 'text-slate-300 bg-white/5 border-transparent hover:bg-white/10'}`}
              >
                <Home size={22} />
                <span className="text-lg font-medium">الرئيسية</span>
              </button>

              <button 
                onClick={() => handleNavigate('CONTACT')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'CONTACT' ? 'bg-primary/20 text-white border-primary/30' : 'text-slate-300 bg-white/5 border-transparent hover:bg-white/10'}`}
              >
                <Phone size={22} />
                <span className="text-lg font-medium">اتصل بنا</span>
              </button>

              {user ? (
                <>
                  <button 
                    onClick={() => handleNavigate('DASHBOARD')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'DASHBOARD' ? 'bg-primary/20 text-white border-primary/30' : 'text-slate-300 bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <LayoutDashboard size={22} />
                    <span className="text-lg font-medium">تتبع الطلبات</span>
                  </button>
                  <button 
                    onClick={() => handleNavigate('REQUEST_FORM')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'REQUEST_FORM' ? 'bg-primary/20 text-white border-primary/30' : 'text-slate-300 bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <PenTool size={22} />
                    <span className="text-lg font-medium">طلب جديد</span>
                  </button>
                  <div className="h-px bg-white/10 my-4"></div>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors border border-transparent"
                  >
                    <LogOut size={22} />
                    <span className="text-lg font-medium">تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <>
                   <button 
                    onClick={() => handleNavigate('REQUEST_FORM')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'REQUEST_FORM' ? 'bg-primary/20 text-white border-primary/30' : 'text-slate-300 bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <PenTool size={22} />
                    <span className="text-lg font-medium">طلب تصميم</span>
                  </button>
                  <div className="h-px bg-white/10 my-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => handleNavigate('LOGIN')}
                      variant="ghost"
                      className="w-full justify-center"
                    >
                      دخول
                    </Button>
                    <Button 
                      onClick={() => handleNavigate('REGISTER')}
                      className="w-full justify-center"
                    >
                      تسجيل
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
