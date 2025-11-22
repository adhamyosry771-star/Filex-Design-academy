
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RequestForm } from './components/RequestForm';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Contact } from './components/Contact';
import { AdminDashboard } from './components/AdminDashboard';
import { PageView, User } from './types';
import { authService } from './services/mockDb';
import { CheckCircle2, ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Show loading screen while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'HOME':
        return <Hero onStart={() => setCurrentPage(user ? 'REQUEST_FORM' : 'REGISTER')} />;
      
      case 'CONTACT':
        return <Contact />;

      case 'LOGIN':
        return (
          <Auth 
            mode="LOGIN" 
            onSuccess={handleLogin} 
            onSwitchMode={setCurrentPage} 
          />
        );
      
      case 'REGISTER':
        return (
          <Auth 
            mode="REGISTER" 
            onSuccess={handleLogin} 
            onSwitchMode={setCurrentPage} 
          />
        );

      case 'DASHBOARD':
        return user ? (
          <Dashboard user={user} onUserUpdate={setUser} />
        ) : (
          <Auth mode="LOGIN" onSuccess={handleLogin} onSwitchMode={setCurrentPage} />
        );

      case 'ADMIN_DASHBOARD':
        return user && user.role === 'ADMIN' ? (
          <AdminDashboard user={user} />
        ) : (
          user ? <Dashboard user={user} onUserUpdate={setUser} /> : <Auth mode="LOGIN" onSuccess={handleLogin} onSwitchMode={setCurrentPage} />
        );

      case 'REQUEST_FORM':
        return (
          <RequestForm 
            user={user}
            onSubmitSuccess={() => setCurrentPage('SUCCESS')} 
            onCancel={() => setCurrentPage('HOME')} 
          />
        );
        
      case 'SUCCESS':
        return (
          <div className="max-w-2xl mx-auto px-4 py-32 text-center animate-fade-in relative z-10">
            <div className="bg-green-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">تم استلام طلبك بنجاح!</h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              شكراً لاختيارك Flex Design Academy. سيقوم فريقنا بمراجعة تفاصيل مشروعك.
              {user && ' يمكنك تتبع حالة الطلب من لوحة التحكم.'}
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setCurrentPage('HOME')} variant="outline">
                <ArrowRight className="ml-2" size={18} />
                العودة للرئيسية
              </Button>
              {user ? (
                <Button onClick={() => setCurrentPage('DASHBOARD')} icon={<LayoutDashboard size={18} />}>
                  متابعة الطلب
                </Button>
              ) : (
                <Button onClick={() => setCurrentPage('REQUEST_FORM')}>
                  تقديم طلب آخر
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return <Hero onStart={() => setCurrentPage('REQUEST_FORM')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 relative overflow-x-hidden">
      {/* Global Background Gradient */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e1b4b] via-[#0f172a] to-[#020617]" />
      
      {/* Global Floating Particles/Stars */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow relative z-10">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
