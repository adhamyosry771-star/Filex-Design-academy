import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PrivacyPolicyProps {
  t: any;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ t }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in relative z-10">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden p-8 md:p-12 transition-colors duration-300">
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {t.lastUpdated}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 border-b border-slate-200 dark:border-white/10 pb-8">
            {t.intro}
          </p>

          <div className="space-y-8">
            {t.sections.map((section: any, index: number) => (
              <div key={index} className="bg-slate-50 dark:bg-black/20 p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-colors">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  {section.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center pt-8 border-t border-slate-200 dark:border-white/10">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © Flex Design Academy. All legal rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
