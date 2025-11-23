
import React, { useState } from 'react';
import { Button } from './Button';
import { authService } from '../services/mockDb';
import { User, PageView } from '../types';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

interface AuthProps {
  mode: 'LOGIN' | 'REGISTER';
  onSuccess: (user: User) => void;
  onSwitchMode: (mode: PageView) => void;
  t: any;
}

export const Auth: React.FC<AuthProps> = ({ mode, onSuccess, onSwitchMode, t }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user: User;
      if (mode === 'REGISTER') {
        user = await authService.register(formData.name, formData.email, formData.password);
      } else {
        user = await authService.login(formData.email, formData.password);
      }
      onSuccess(user);
    } catch (err: any) {
      let message = 'An error occurred';
      if (err.code === 'auth/invalid-credential') message = 'Email or password incorrect';
      else if (err.code === 'auth/user-not-found') message = 'User not found';
      else if (err.code === 'auth/wrong-password') message = 'Wrong password';
      else if (err.code === 'auth/email-already-in-use') message = 'Email already in use';
      else if (err.code === 'auth/weak-password') message = 'Password too weak';
      else if (err.message) message = err.message;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500";
  const iconClasses = "absolute rtl:right-3 ltr:left-3 top-3.5 text-slate-400";

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in relative z-10">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
        <div className="bg-slate-50 dark:bg-white/5 px-8 py-8 border-b border-slate-200 dark:border-white/10 text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {mode === 'LOGIN' ? t.loginTitle : t.registerTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {mode === 'LOGIN' ? t.loginSub : t.registerSub}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {mode === 'REGISTER' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.name}</label>
              <div className="relative">
                <UserIcon className={iconClasses} size={18} />
                <input
                  type="text"
                  required
                  className={inputClasses}
                  placeholder={t.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.email}</label>
            <div className="relative">
              <Mail className={iconClasses} size={18} />
              <input
                type="email"
                required
                className={inputClasses}
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{t.password}</label>
            <div className="relative">
              <Lock className={iconClasses} size={18} />
              <input
                type="password"
                required
                className={inputClasses}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300 text-sm bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" isLoading={loading} className="w-full py-3.5 text-lg shadow-[0_0_20px_rgba(129,140,248,0.3)]">
            {mode === 'LOGIN' ? t.btnLogin : t.btnRegister}
            {mode === 'LOGIN' ? <LogIn size={20} className="ml-2 rtl:ml-2 ltr:ml-0 ltr:mr-2" /> : <UserPlus size={20} className="ml-2 rtl:ml-2 ltr:ml-0 ltr:mr-2" />}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => onSwitchMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium"
            >
              {mode === 'LOGIN' ? t.noAccount : t.haveAccount}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
