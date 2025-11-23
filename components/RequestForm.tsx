
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ProjectType, DesignRequest, User, Language } from '../types';
import { refineDesignBrief } from '../services/geminiService';
import { requestService } from '../services/mockDb';
import { Wand2, Send, AlertCircle } from 'lucide-react';

interface RequestFormProps {
  user: User | null;
  initialProjectType: ProjectType | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
  t: any;
  language: Language;
}

export const RequestForm: React.FC<RequestFormProps> = ({ user, initialProjectType, onSubmitSuccess, onCancel, t, language }) => {
  const [formData, setFormData] = useState<Omit<DesignRequest, 'id' | 'status' | 'createdAt'>>({
    clientName: user?.name || '',
    email: user?.email || '',
    projectType: initialProjectType || ProjectType.LOGO,
    description: '',
    budget: '',
    userId: user?.id
  });

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        clientName: user.name,
        email: user.email,
        userId: user.id
      }));
    }
  }, [user]);

  // Update Project Type if prop changes (e.g., coming from Hero service card)
  useEffect(() => {
    if (initialProjectType) {
      setFormData(prev => ({ ...prev, projectType: initialProjectType }));
    }
  }, [initialProjectType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description || formData.description.length < 10) {
      setAiError(language === 'ar' ? "الرجاء كتابة وصف أولي (10 أحرف على الأقل) قبل طلب المساعدة." : "Please write a description (10+ chars) first.");
      return;
    }
    
    setAiError(null);
    setIsEnhancing(true);
    
    try {
      const refinedText = await refineDesignBrief(formData.description, formData.projectType);
      setFormData(prev => ({ ...prev, description: refinedText }));
    } catch (error) {
      setAiError(language === 'ar' ? "حدث خطأ أثناء الاتصال بـ Gemini." : "AI Connection Error.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await requestService.createRequest(formData);
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting request", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-white/5";
  const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in relative z-10">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
        <div className="bg-slate-50 dark:bg-white/5 px-8 py-6 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {user 
              ? `${t.loggedInAs} ${user.name}، ${t.enterDetails}` 
              : t.guestMsg}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="clientName" className={labelClasses}>{t.fullName}</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                required
                className={inputClasses}
                placeholder={t.placeholderName}
                value={formData.clientName}
                onChange={handleInputChange}
                disabled={!!user}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>{t.email}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={inputClasses}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!!user}
              />
            </div>
          </div>

          {/* Project Details */}
          <div>
            <label htmlFor="projectType" className={labelClasses}>{t.projectType}</label>
            <select
              id="projectType"
              name="projectType"
              className={`${inputClasses} appearance-none text-slate-800 dark:text-slate-200 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-white`}
              value={formData.projectType}
              onChange={handleInputChange}
            >
              {Object.values(ProjectType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.projectDetails}</label>
              <button
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isEnhancing}
                className="text-xs flex items-center gap-1 text-primary hover:text-white font-medium transition-colors disabled:opacity-50 bg-primary/10 dark:bg-white/5 px-3 py-1 rounded-full hover:bg-primary/80"
              >
                <Wand2 size={14} />
                {t.enhanceBtn}
              </button>
            </div>
            
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              className={inputClasses}
              placeholder={t.placeholderDesc}
              value={formData.description}
              onChange={handleInputChange}
            />
            
            {/* AI Feedback Area */}
            {aiError && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-300 text-sm bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 rounded-lg mt-2">
                <AlertCircle size={16} />
                <span>{aiError}</span>
              </div>
            )}
            
            <p className="text-xs text-slate-500 mt-2">
              {t.enhanceTip}
            </p>
          </div>

          <div>
            <label htmlFor="budget" className={labelClasses}>{t.budget}</label>
            <input
              type="text"
              id="budget"
              name="budget"
              className={inputClasses}
              placeholder={t.placeholderBudget}
              value={formData.budget}
              onChange={handleInputChange}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
              className="w-full sm:w-auto text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              {t.cancel}
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting} 
              className={`w-full sm:w-auto shadow-[0_0_20px_rgba(129,140,248,0.3)] ${language === 'ar' ? 'mr-auto' : 'ml-auto'}`}
              icon={<Send size={18} />}
            >
              {t.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
