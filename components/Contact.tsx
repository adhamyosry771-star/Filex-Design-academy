
import React, { useState } from 'react';
import { Button } from './Button';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { requestService } from '../services/mockDb';
import { Language } from '../types';

interface ContactProps {
  t: any;
  language: Language;
}

export const Contact: React.FC<ContactProps> = ({ t, language }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestService.sendMessage(formData.name, formData.phone, formData.message);
      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-fade-in relative z-10">
      
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-slate-800 dark:text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-colors">
          {t.title}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
          {t.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Cards */}
        <div className="space-y-6">
          {/* Phone Card - Featured */}
          <div className="bg-gradient-to-r from-primary/10 to-indigo-600/10 dark:from-primary/20 dark:to-indigo-600/20 backdrop-blur-xl border border-primary/20 dark:border-primary/30 p-8 rounded-3xl hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(129,140,248,0.15)]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/40">
                <Phone size={32} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-slate-600 dark:text-slate-300 font-semibold mb-1">{t.callUs}</h3>
                <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-widest font-mono">01027833873</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-3xl hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-pink-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-pink-500 dark:text-pink-400">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-slate-600 dark:text-slate-300 font-semibold mb-1">{t.emailUs}</h3>
                <p className="text-xl font-bold text-slate-800 dark:text-white">contact@flexdesign.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-3xl hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-cyan-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-cyan-500 dark:text-cyan-400">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-slate-600 dark:text-slate-300 font-semibold mb-1">{t.hq}</h3>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{t.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-lg dark:shadow-none transition-colors">
           <div className={`absolute top-0 ${language === 'ar' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none`} />
           
           <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
             <MessageSquare className="text-primary" />
             {t.sendMessage}
           </h3>
           
           {success ? (
             <div className="h-full flex flex-col items-center justify-center text-center py-10">
               <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 size={32} />
               </div>
               <h4 className="text-xl font-bold text-slate-800 dark:text-white">{t.successTitle}</h4>
               <p className="text-slate-500 dark:text-slate-400 mt-2">{t.successDesc}</p>
               <Button onClick={() => setSuccess(false)} variant="ghost" className="mt-6">{t.sendAnother}</Button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm text-slate-600 dark:text-slate-300">{t.name}</label>
                   <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-primary text-slate-900 dark:text-white outline-none" 
                    placeholder={t.name} 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm text-slate-600 dark:text-slate-300">{t.phone}</label>
                   <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-primary text-slate-900 dark:text-white outline-none" 
                    placeholder="01xxxxxxxxx" 
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm text-slate-600 dark:text-slate-300">{t.message}</label>
                 <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-primary text-slate-900 dark:text-white outline-none" 
                  placeholder={t.msgPlaceholder}
                 ></textarea>
               </div>
               <Button type="submit" isLoading={isSubmitting} className="w-full py-4 text-lg" icon={<Send size={20} />}>
                 {t.sendBtn}
               </Button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};
