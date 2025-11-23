
import React, { useState, useEffect, useRef } from 'react';
import { Palette, Menu, LogIn, User as UserIcon, LogOut, X, LayoutDashboard, Phone, Home, PenTool, ShieldCheck, Sun, Moon, Bell, Check, Megaphone, ArrowLeft, Headphones, Globe } from 'lucide-react';
import { PageView, User, Notification, Announcement, Language } from '../types';
import { Button } from './Button';
import { notificationService, announcementService } from '../services/mockDb';

interface NavbarProps {
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, currentPage, user, onLogout, isDarkMode, toggleTheme, language, setLanguage, t 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Notification States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<Set<string>>(new Set());
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'SYSTEM' | 'OFFICIAL'>('OFFICIAL');
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const unsubscribeNotifs = notificationService.getUserNotifications(user.id, (notifs) => {
        setNotifications(notifs);
      });
      const unsubscribeAnnounce = announcementService.getAnnouncements((list) => {
        setAnnouncements(list);
      });
      const unsubReadIds = announcementService.getReadIds(user.id, (ids) => {
        setReadAnnouncementIds(ids);
      });

      return () => {
        unsubscribeNotifs();
        unsubscribeAnnounce();
        unsubReadIds();
      };
    } else {
      setNotifications([]);
      setAnnouncements([]);
      setReadAnnouncementIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadSystemCount = notifications.filter(n => !n.isRead).length;
  const unreadOfficialCount = announcements.filter(a => !readAnnouncementIds.has(a.id)).length;
  const totalUnread = unreadSystemCount + unreadOfficialCount;

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    if (user) {
      await notificationService.markAllAsRead(user.id);
    }
  };

  const navLinkClass = (page: PageView) => 
    `text-sm font-medium transition-colors relative hover:text-primary dark:hover:text-white ${currentPage === page ? 'text-primary dark:text-white after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-primary after:shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'text-slate-600 dark:text-slate-400'}`;

  const handleNavigate = (page: PageView) => {
    onNavigate(page);
    setIsMenuOpen(false);
    setShowNotifications(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
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
            <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-wide transition-colors">
              Flex<span className="text-primary">Design</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button onClick={() => handleNavigate('HOME')} className={navLinkClass('HOME')}>
              {t.home}
            </button>
            
            <button onClick={() => handleNavigate('CONTACT')} className={navLinkClass('CONTACT')}>
              {t.contact}
            </button>

            {user && (
              <button onClick={() => handleNavigate('LIVE_SUPPORT')} className={navLinkClass('LIVE_SUPPORT')}>
                {t.liveSupport}
              </button>
            )}
            
            {!user && (
              <button
                onClick={() => handleNavigate('REQUEST_FORM')}
                className={navLinkClass('REQUEST_FORM')}
              >
                {t.requestDesign}
              </button>
            )}

            <div className="flex items-center gap-4">
               {/* Language Switcher Desktop */}
               <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1 border border-slate-200 dark:border-white/10">
                 <button onClick={() => setLanguage('ar')} className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'ar' ? 'bg-white dark:bg-white/20 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-800'}`}>AR</button>
                 <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-white/20 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-800'}`}>EN</button>
                 <button onClick={() => setLanguage('fr')} className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'fr' ? 'bg-white dark:bg-white/20 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-800'}`}>FR</button>
               </div>

              {/* Theme Toggle Desktop */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="h-6 w-px bg-slate-300 dark:bg-white/10 mx-2"></div>

              {user ? (
                <div className="flex items-center gap-4">
                  {/* Notifications Bell */}
                  <div className="relative" ref={notifRef}>
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors relative"
                    >
                      <Bell size={20} />
                      {totalUnread > 0 && (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-white dark:border-[#0f172a] flex items-center justify-center text-[9px] text-white font-bold">
                          {totalUnread > 9 ? '+9' : totalUnread}
                        </span>
                      )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute top-12 rtl:left-0 ltr:right-0 w-80 md:w-96 bg-white dark:bg-[#1e293b] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up z-50 flex flex-col">
                        
                        {/* Tabs Header */}
                        <div className="flex border-b border-slate-100 dark:border-white/5">
                          <button 
                            onClick={() => setActiveNotifTab('OFFICIAL')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeNotifTab === 'OFFICIAL' ? 'text-primary bg-slate-50 dark:bg-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Megaphone size={16} /> {language === 'ar' ? 'رسائل رسمية' : 'Official'}
                              {unreadOfficialCount > 0 && <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">{unreadOfficialCount}</span>}
                            </span>
                            {activeNotifTab === 'OFFICIAL' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                          </button>
                          <button 
                            onClick={() => setActiveNotifTab('SYSTEM')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeNotifTab === 'SYSTEM' ? 'text-primary bg-slate-50 dark:bg-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                          >
                             <span className="flex items-center justify-center gap-2">
                              <Bell size={16} /> {language === 'ar' ? 'رسايل النظام' : 'System'}
                               {unreadSystemCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadSystemCount}</span>}
                            </span>
                            {activeNotifTab === 'SYSTEM' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                          </button>
                        </div>

                        {/* Content Body */}
                        <div className="max-h-[350px] overflow-y-auto">
                          
                          {/* SYSTEM MESSAGES */}
                          {activeNotifTab === 'SYSTEM' && (
                             <>
                                <div className="p-3 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
                                  <span className="text-xs font-semibold text-slate-500">تحديثات الطلبات</span>
                                  {unreadSystemCount > 0 && (
                                    <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">تحديد الكل كمقروء</button>
                                  )}
                                </div>
                                {notifications.length === 0 ? (
                                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center gap-2">
                                    <Bell size={32} className="opacity-20" />
                                    لا توجد إشعارات جديدة من النظام
                                  </div>
                                ) : (
                                  notifications.slice(0, 5).map((notif) => (
                                    <div 
                                      key={notif.id} 
                                      className={`p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors relative group ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                                    >
                                      <div className="flex gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <div className="flex-1">
                                          <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-800 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                                            {notif.title}
                                          </h4>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                                            {notif.message}
                                          </p>
                                          <span className="text-[10px] text-slate-400 mt-2 block">
                                            {new Date(notif.createdAt).toLocaleDateString('ar-EG')}
                                          </span>
                                        </div>
                                      </div>
                                      {!notif.isRead && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif.id); }}
                                          className="absolute top-4 left-4 text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="تحديد كمقروء"
                                        >
                                          <Check size={14} />
                                        </button>
                                      )}
                                    </div>
                                  ))
                                )}
                             </>
                          )}

                          {/* OFFICIAL MESSAGES */}
                          {activeNotifTab === 'OFFICIAL' && (
                            <>
                              <div className="p-3 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 sticky top-0 z-10 backdrop-blur-md">
                                <span className="text-xs font-semibold text-slate-500">تنويهات الإدارة</span>
                              </div>
                              {announcements.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center gap-2">
                                  <Megaphone size={32} className="opacity-20" />
                                  لا توجد رسائل رسمية حالياً
                                </div>
                              ) : (
                                announcements.slice(0, 3).map((ann) => {
                                  const isUnread = !readAnnouncementIds.has(ann.id);
                                  return (
                                    <div 
                                      key={ann.id} 
                                      className={`p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${isUnread ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                                    >
                                      <div className="flex gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 flex items-center justify-center shrink-0 relative">
                                          <ShieldCheck size={16} />
                                          {isUnread && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border border-white"></div>}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex justify-between">
                                            <h4 className={`text-sm ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                                              {ann.title}
                                            </h4>
                                          </div>
                                          <div className="bg-slate-50 dark:bg-black/20 p-2 rounded-lg mt-2 border border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                                              {ann.message}
                                            </p>
                                          </div>
                                          <div className="flex justify-between items-center mt-2">
                                             <span className="text-[10px] text-slate-400">
                                              {new Date(ann.createdAt).toLocaleDateString('ar-EG')}
                                            </span>
                                            <span className="text-[10px] text-primary/70">
                                              بواسطة: {ann.createdBy}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </>
                          )}
                        </div>
                        
                        {/* Footer Link to All Messages */}
                        <div className="p-2 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                           <button 
                             onClick={() => handleNavigate('USER_MESSAGES')}
                             className="w-full py-2 text-center text-sm font-bold text-primary hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center justify-center gap-2 group"
                           >
                             {language === 'ar' ? 'عرض كافة الرسائل والمحادثات' : 'View All Messages'}
                             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform rtl:rotate-0 ltr:rotate-180" />
                           </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => handleNavigate('ADMIN_DASHBOARD')}
                      className={`flex items-center gap-2 text-sm font-bold transition-all px-3 py-1.5 rounded-lg ${currentPage === 'ADMIN_DASHBOARD' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 hover:bg-amber-200 dark:hover:bg-amber-500/20'}`}
                    >
                      <ShieldCheck size={16} />
                      <span>{t.adminPanel}</span>
                    </button>
                  )}

                  <button 
                    onClick={() => handleNavigate('DASHBOARD')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentPage === 'DASHBOARD' ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white'}`}
                  >
                    <UserIcon size={18} />
                    <span>{user.name}</span>
                  </button>
                  <button 
                    onClick={onLogout}
                    className="text-slate-500 hover:text-red-500 transition-colors"
                    title={t.logout}
                  >
                    <LogOut size={18} />
                  </button>
                  <Button
                    onClick={() => handleNavigate('REQUEST_FORM')}
                    className="!px-4 !py-2 text-sm ml-2"
                    variant="glass"
                  >
                    {t.requestNew}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleNavigate('LOGIN')}
                    className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                  >
                    {t.login}
                  </button>
                  <Button 
                    onClick={() => handleNavigate('REGISTER')}
                    className="!px-4 !py-2 text-sm"
                    variant="primary"
                    icon={<LogIn size={16} />}
                  >
                    {t.register}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative z-50">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-800 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl pt-24 px-6 animate-fade-in h-screen overflow-y-auto transition-colors duration-300">
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            
            {/* Theme Toggle Mobile */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-4 rounded-2xl mb-2 border border-slate-200 dark:border-white/10">
              <span className="text-slate-700 dark:text-slate-300 font-medium">{t.theme}</span>
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 bg-white dark:bg-white/10 px-4 py-2 rounded-xl text-primary font-bold shadow-sm"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={20} />
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                  </>
                )}
              </button>
            </div>

            {/* Language Switcher Mobile */}
             <div className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-4 rounded-2xl mb-2 border border-slate-200 dark:border-white/10">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"><Globe size={18}/> {t.language}</span>
              <div className="flex gap-2">
                 <button onClick={() => setLanguage('ar')} className={`px-3 py-1.5 rounded-lg font-bold text-sm ${language === 'ar' ? 'bg-primary text-white' : 'bg-white dark:bg-white/10 text-slate-500'}`}>العربية</button>
                 <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 rounded-lg font-bold text-sm ${language === 'en' ? 'bg-primary text-white' : 'bg-white dark:bg-white/10 text-slate-500'}`}>English</button>
                 <button onClick={() => setLanguage('fr')} className={`px-3 py-1.5 rounded-lg font-bold text-sm ${language === 'fr' ? 'bg-primary text-white' : 'bg-white dark:bg-white/10 text-slate-500'}`}>Français</button>
              </div>
            </div>

             {/* Notifications Mobile Link */}
             {user && (
              <button 
                onClick={() => handleNavigate('USER_MESSAGES')}
                className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl mb-2 border border-slate-200 dark:border-white/10 w-full text-start hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                   <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                     <Bell size={18} /> {t.messages}
                   </span>
                   {totalUnread > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{totalUnread}</span>}
                </div>
              </button>
             )}

            {user && (
              <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-6 mb-2 border border-slate-200 dark:border-white/10 flex items-center gap-4 shadow-lg">
                 <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <UserIcon size={24} />
                 </div>
                 <div className="flex-1">
                    <div className="text-slate-800 dark:text-white font-bold text-lg flex items-center gap-2">
                      {user.name}
                      {user.role === 'ADMIN' && <ShieldCheck size={16} className="text-amber-500" />}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                 </div>
              </div>
            )}

            <div className="space-y-2">
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={() => handleNavigate('ADMIN_DASHBOARD')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border mb-2 ${currentPage === 'ADMIN_DASHBOARD' ? 'bg-amber-500 text-white border-amber-600' : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'}`}
                >
                  <ShieldCheck size={22} />
                  <span className="text-lg font-bold">{t.adminPanel}</span>
                </button>
              )}

              <button 
                onClick={() => handleNavigate('HOME')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'HOME' ? 'bg-primary/20 text-primary dark:text-white border-primary/30' : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'}`}
              >
                <Home size={22} />
                <span className="text-lg font-medium">{t.home}</span>
              </button>

              <button 
                onClick={() => handleNavigate('CONTACT')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'CONTACT' ? 'bg-primary/20 text-primary dark:text-white border-primary/30' : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'}`}
              >
                <Phone size={22} />
                <span className="text-lg font-medium">{t.contact}</span>
              </button>

              {user && (
                <button 
                  onClick={() => handleNavigate('LIVE_SUPPORT')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'LIVE_SUPPORT' ? 'bg-primary/20 text-primary dark:text-white border-primary/30' : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  <Headphones size={22} />
                  <span className="text-lg font-medium">{t.liveSupport}</span>
                </button>
              )}

              {user ? (
                <>
                  <button 
                    onClick={() => handleNavigate('DASHBOARD')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'DASHBOARD' ? 'bg-primary/20 text-primary dark:text-white border-primary/30' : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'}`}
                  >
                    <LayoutDashboard size={22} />
                    <span className="text-lg font-medium">{t.dashboard}</span>
                  </button>
                  <button 
                    onClick={() => handleNavigate('REQUEST_FORM')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'REQUEST_FORM' ? 'bg-primary/20 text-primary dark:text-white border-primary/30' : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'}`}
                  >
                    <PenTool size={22} />
                    <span className="text-lg font-medium">{t.requestNew}</span>
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-white/10 my-4"></div>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-transparent"
                  >
                    <LogOut size={22} />
                    <span className="text-lg font-medium">{t.logout}</span>
                  </button>
                </>
              ) : (
                <>
                   <button 
                    onClick={() => handleNavigate('REQUEST_FORM')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${currentPage === 'REQUEST_FORM' ? 'bg-primary/20 text-primary dark:text-white border-primary/30' : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'}`}
                  >
                    <PenTool size={22} />
                    <span className="text-lg font-medium">{t.requestDesign}</span>
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-white/10 my-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => handleNavigate('LOGIN')}
                      variant="ghost"
                      className="w-full justify-center text-slate-700 dark:text-slate-300"
                    >
                      {t.login}
                    </Button>
                    <Button 
                      onClick={() => handleNavigate('REGISTER')}
                      className="w-full justify-center"
                    >
                      {t.register}
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
