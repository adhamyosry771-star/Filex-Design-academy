

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RequestForm } from './components/RequestForm';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Contact } from './components/Contact';
import { AdminDashboard } from './components/AdminDashboard';
import { UserMessages } from './components/UserMessages';
import { LiveSupport } from './components/LiveSupport'; 
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { IntroOverlay } from './components/IntroOverlay';
import { PageView, User, Language, ProjectType } from './types';
import { authService, requestService } from './services/mockDb';
import { CheckCircle2, ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';
import { Button } from './components/Button';
import { translations } from './i18n';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageView>('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'ar';
  });

  // Aggressive Scroll Reset
  useLayoutEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Backup timer in case of async rendering delays
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [currentPage]); // Re-run when page changes

  useEffect(() => {
    // Apply theme class to HTML element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Apply Language Direction and Attribute
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    // Subscribe to Firebase Auth changes
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    // --- TRACK VISITOR ---
    // This runs once when the app mounts to count the visit
    requestService.trackVisitor();

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'ADMIN') {
      setCurrentPage('ADMIN_DASHBOARD');
    } else {
      setCurrentPage('DASHBOARD');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCurrentPage('HOME');
  };

  const handleServiceClick = (type: ProjectType) => {
    setSelectedProjectType(type);
    setCurrentPage('REQUEST_FORM');
    window.scrollTo(0, 0);
  };

  const t = translations[language]; // Current translations

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 relative overflow-x-hidden transition-colors duration-300">
      
      {/* Sci-Fi Intro Overlay */}
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}

      {/* Global Background Gradient - Adapts to Theme */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-[#1e1b4b] dark:via-[#0f172a] dark:to-[#020617] transition-colors duration-500" />
      
      {/* Global Floating Particles/Stars */}
      <div className="fixed inset-0 z-0 opacity-10 dark:opacity-30 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

      {authLoading ? (
         <div className="min-h-screen flex items-center justify-center relative z-10">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
         </div>
      ) : (
        <>
          <Navbar 
            onNavigate={setCurrentPage} 
            currentPage={currentPage} 
            user={user}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            language={language}
            setLanguage={setLanguage}
            t={t.nav}
          />
          
          <main className="flex-grow relative z-10 min-h-[calc(100vh-80px)]">
            {(() => {
              switch (currentPage) {
                case 'HOME':
                  return <Hero onStart={() => setCurrentPage(user ? 'REQUEST_FORM' : 'REGISTER')} onServiceClick={handleServiceClick} t={t.hero} language={language} />;
                
                case 'CONTACT':
                  return <Contact t={t.contact} language={language} />;

                case 'PRIVACY':
                  return <PrivacyPolicy t={t.privacy} />;

                case 'LOGIN':
                  return (
                    <Auth 
                      mode="LOGIN" 
                      onSuccess={handleLogin} 
                      onSwitchMode={setCurrentPage} 
                      t={t.auth}
                    />
                  );
                
                case 'REGISTER':
                  return (
                    <Auth 
                      mode="REGISTER" 
                      onSuccess={handleLogin} 
                      onSwitchMode={setCurrentPage} 
                      t={t.auth}
                    />
                  );

                case 'DASHBOARD':
                  return user ? (
                    <Dashboard user={user} onUserUpdate={setUser} t={t.dashboard} />
                  ) : (
                    <Auth mode="LOGIN" onSuccess={handleLogin} onSwitchMode={setCurrentPage} t={t.auth} />
                  );

                case 'ADMIN_DASHBOARD':
                  return user && user.role === 'ADMIN' ? (
                    <AdminDashboard user={user} t={t.admin} language={language} />
                  ) : (
                    user ? <Dashboard user={user} onUserUpdate={setUser} t={t.dashboard} /> : <Auth mode="LOGIN" onSuccess={handleLogin} onSwitchMode={setCurrentPage} t={t.auth} />
                  );

                case 'USER_MESSAGES':
                  return user ? (
                    <UserMessages user={user} t={t.messages} />
                  ) : (
                    <Auth mode="LOGIN" onSuccess={handleLogin} onSwitchMode={setCurrentPage} t={t.auth} />
                  );

                case 'LIVE_SUPPORT':
                  return user ? (
                    <LiveSupport user={user} t={t.support} />
                  ) : (
                    <Auth mode="LOGIN" onSuccess={handleLogin} onSwitchMode={setCurrentPage} t={t.auth} />
                  );

                case 'REQUEST_FORM':
                  return (
                    <RequestForm 
                      user={user}
                      initialProjectType={selectedProjectType}
                      onSubmitSuccess={() => {
                        setCurrentPage('SUCCESS');
                        setSelectedProjectType(null);
                      }} 
                      onCancel={() => {
                        setCurrentPage('HOME');
                        setSelectedProjectType(null);
                      }} 
                      t={t.form}
                      language={language}
                    />
                  );
                  
                case 'SUCCESS':
                  return (
                    <div className="max-w-2xl mx-auto px-4 py-32 text-center animate-fade-in relative z-10">
                      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-6">
                          <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{t.success.title}</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                          {t.success.desc}
                          <br />
                          {t.success.track}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button 
                            onClick={() => setCurrentPage('DASHBOARD')}
                            variant="primary"
                            icon={<LayoutDashboard size={20} />}
                          >
                            {t.nav.dashboard}
                          </Button>
                          <Button 
                            onClick={() => setCurrentPage('REQUEST_FORM')}
                            variant="outline"
                          >
                            {t.success.newRequest}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                  
                default:
                  return <Hero onStart={() => setCurrentPage(user ? 'REQUEST_FORM' : 'REGISTER')} onServiceClick={handleServiceClick} t={t.hero} language={language} />;
              }
            })()}
          </main>

          <Footer t={t.footer} onNavigate={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default App;