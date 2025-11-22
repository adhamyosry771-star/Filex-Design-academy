
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ProjectType, DesignRequest, User } from '../types';
import { refineDesignBrief } from '../services/geminiService';
import { requestService } from '../services/mockDb';
import { Wand2, Send, AlertCircle } from 'lucide-react';

interface RequestFormProps {
  user: User | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ user, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<DesignRequest, 'id' | 'status' | 'createdAt'>>({
    clientName: user?.name || '',
    email: user?.email || '',
    projectType: ProjectType.LOGO,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description || formData.description.length < 10) {
      setAiError("الرجاء كتابة وصف أولي (10 أحرف على الأقل) قبل طلب المساعدة.");
      return;
    }
    
    setAiError(null);
    setIsEnhancing(true);
    
    try {
      const refinedText = await refineDesignBrief(formData.description, formData.projectType);
      setFormData(prev => ({ ...prev, description: refinedText }));
    } catch (error) {
      setAiError("حدث خطأ أثناء الاتصال بـ Gemini. حاول مرة أخرى.");
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

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "block text-sm font-semibold text-slate-300 mb-2";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in relative z-10">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 px-8 py-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">طلب تصميم جديد</h2>
          <p className="text-slate-400 mt-1">
            {user 
              ? `مرحباً ${user.name}، أدخل تفاصيل مشروعك الجديد.` 
              : 'أدخل تفاصيل مشروعك وسنقوم بالرد عليك في أقرب وقت.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="clientName" className={labelClasses}>الاسم الكامل</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                required
                className={inputClasses}
                placeholder="مثال: محمد أحمد"
                value={formData.clientName}
                onChange={handleInputChange}
                disabled={!!user}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>البريد الإلكتروني</label>
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
            <label htmlFor="projectType" className={labelClasses}>نوع المشروع</label>
            <select
              id="projectType"
              name="projectType"
              className={`${inputClasses} appearance-none text-slate-200 [&>option]:bg-slate-800`}
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
              <label htmlFor="description" className="text-sm font-semibold text-slate-300">تفاصيل المشروع</label>
              <button
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isEnhancing}
                className="text-xs flex items-center gap-1 text-primary hover:text-white font-medium transition-colors disabled:opacity-50 bg-white/5 px-3 py-1 rounded-full hover:bg-primary/20"
              >
                <Wand2 size={14} />
                تحسين الوصف بالذكاء الاصطناعي
              </button>
            </div>
            
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              className={inputClasses}
              placeholder="صف مشروعك هنا... ما هي الفكرة؟ ما هي الألوان المفضلة؟"
              value={formData.description}
              onChange={handleInputChange}
            />
            
            {/* AI Feedback Area */}
            {aiError && (
              <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-2">
                <AlertCircle size={16} />
                <span>{aiError}</span>
              </div>
            )}
            
            <p className="text-xs text-slate-500 mt-2">
              نصيحة: يمكنك كتابة فكرة بسيطة والضغط على "تحسين الوصف" ليقوم Gemini بصياغتها بشكل احترافي.
            </p>
          </div>

          <div>
            <label htmlFor="budget" className={labelClasses}>الميزانية المتوقعة (اختياري)</label>
            <input
              type="text"
              id="budget"
              name="budget"
              className={inputClasses}
              placeholder="مثال: 500$ - 1000$"
              value={formData.budget}
              onChange={handleInputChange}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting} 
              className="w-full sm:w-auto mr-auto shadow-[0_0_20px_rgba(129,140,248,0.3)]"
              icon={<Send size={18} />}
            >
              إرسال الطلب
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};