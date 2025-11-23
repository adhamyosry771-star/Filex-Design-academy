import React, { useState, useEffect } from 'react';
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
import { IntroOverlay } from './components/IntroOverlay';
import { PageView, User, Language, ProjectType } from './types';
import { authService } from './services/mockDb';
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
    // Scroll to top
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
          
          <main className="flex-grow relative z-10">
            {(() => {
              switch (currentPage) {
                case 'HOME':
                  return <Hero onStart={() => setCurrentPage(user ? 'REQUEST_FORM' : 'REGISTER')} onServiceClick={handleServiceClick} t={t.hero} language={language} />;
                
                case 'CONTACT':
                  return <Contact t={t.contact} language={language} />;

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
                    <AdminDashboard user={user} />
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
                      <div className="bg-green-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 drop-shadow-lg">
                        {t.success.title}
                      </h2>
                      <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                        {t.success.desc}
                        {user && ` ${t.success.track}`}
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button onClick={() => setCurrentPage('HOME')} variant="outline">
                          <ArrowRight className="ml-2 rtl:ml-2 ltr:ml-0 ltr:mr-2" size={18} />
                          {t.nav.home}
                        </Button>
                        {user ? (
                          <Button onClick={() => setCurrentPage('DASHBOARD')} icon={<LayoutDashboard size={18} />}>
                            {t.nav.dashboard}
                          </Button>
                        ) : (
                          <Button onClick={() => setCurrentPage('REQUEST_FORM')}>
                            {t.success.newRequest}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                default:
                  return <Hero onStart={() => setCurrentPage('REQUEST_FORM')} onServiceClick={handleServiceClick} t={t.hero} language={language} />;
              }
            })()}
          </main>
          
          <Footer t={t.footer} />
        </>
      )}
    </div>
  );
};

export default App;