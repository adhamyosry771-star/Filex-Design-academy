
import React, { useState } from 'react';
import { Button } from './Button';
import { authService } from '../services/mockDb';
import { User, PageView } from '../types';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

interface AuthProps {
  mode: 'LOGIN' | 'REGISTER';
  onSuccess: (user: User) => void;
  onSwitchMode: (mode: PageView) => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onSuccess, onSwitchMode }) => {
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
      setError(err.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pr-10 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white placeholder-slate-500";
  const iconClasses = "absolute right-3 top-3.5 text-slate-400";

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in relative z-10">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 px-8 py-8 border-b border-white/10 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'LOGIN' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-slate-400">
            {mode === 'LOGIN' 
              ? 'مرحباً بك مجدداً في عالم فليكس' 
              : 'انضم إلينا وابدأ رحلة تصميم مشاريعك'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {mode === 'REGISTER' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">الاسم</label>
              <div className="relative">
                <UserIcon className={iconClasses} size={18} />
                <input
                  type="text"
                  required
                  className={inputClasses}
                  placeholder="الاسم الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">البريد الإلكتروني</label>
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
            <label className="block text-sm font-semibold text-slate-300">كلمة المرور</label>
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
            <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" isLoading={loading} className="w-full py-3.5 text-lg shadow-[0_0_20px_rgba(129,140,248,0.3)]">
            {mode === 'LOGIN' ? 'دخول' : 'تسجيل'}
            {mode === 'LOGIN' ? <LogIn size={20} className="mr-2" /> : <UserPlus size={20} className="mr-2" />}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => onSwitchMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
              className="text-sm text-slate-400 hover:text-primary transition-colors font-medium"
            >
              {mode === 'LOGIN' 
                ? 'ليس لديك حساب؟ سجل الآن' 
                : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};