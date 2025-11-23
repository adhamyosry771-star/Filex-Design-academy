import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { supportService } from '../services/mockDb';
import { MessageCircle, X, Send, User as UserIcon, Bot, ChevronLeft, Loader2 } from 'lucide-react';

interface ChatWidgetProps {
  user: User | null;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isBotMode, setIsBotMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Bot predefined flows
  const botOptions = [
    { id: 'pricing', label: 'أسعار التصميم' },
    { id: 'services', label: 'خدماتنا' },
    { id: 'human', label: 'تحدث مع خدمة العملاء' },
  ];

  // Check for active session on load
  useEffect(() => {
    if (user) {
      const unsub = supportService.getUserActiveSession(user.id, (sessionId) => {
        if (sessionId) {
          setActiveSessionId(sessionId);
          setIsBotMode(false); // If session exists, we are in human mode
        } else {
          setActiveSessionId(null);
          // Only revert to bot if we aren't already looking at it locally
          // Ideally we reset to bot when session closes
        }
      });
      return () => unsub();
    }
  }, [user]);

  // Load messages if session active
  useEffect(() => {
    if (activeSessionId) {
      const unsub = supportService.getMessages(activeSessionId, (msgs) => {
        setMessages(msgs);
        scrollToBottom();
      });
      return () => unsub();
    }
  }, [activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBotOption = async (optionId: string) => {
    // Add user selection as a fake message
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), senderId: 'user', senderName: 'Me', text: '', timestamp: new Date().toISOString(), isAdmin: false 
    };
    
    // Add bot response
    let botResponseText = '';

    if (optionId === 'pricing') {
       userMsg.text = 'أسعار التصميم';
       botResponseText = 'تختلف الأسعار حسب نوع المشروع. الشعارات تبدأ من 50$، الهوية الكاملة من 200$. يمكنك الاطلاع على التفاصيل في صفحة طلب التصميم.';
       setMessages(prev => [...prev, userMsg, { ...userMsg, id: 'bot-'+Date.now(), senderId: 'bot', senderName: 'Bot', text: botResponseText, isAdmin: true }]);
    } else if (optionId === 'services') {
       userMsg.text = 'خدماتنا';
       botResponseText = 'نقدم خدمات: تصميم الشعارات، الهوية البصرية، واجهات المواقع (UI/UX)، ومنتجات الوكالات الصوتية.';
       setMessages(prev => [...prev, userMsg, { ...userMsg, id: 'bot-'+Date.now(), senderId: 'bot', senderName: 'Bot', text: botResponseText, isAdmin: true }]);
    } else if (optionId === 'human') {
       if (!user) {
         setMessages(prev => [...prev, { ...userMsg, id: 'bot-err', senderId: 'bot', senderName: 'Bot', text: 'يجب تسجيل الدخول أولاً للتحدث مع ممثل خدمة العملاء.', isAdmin: true }]);
         return;
       }
       setIsBotMode(false);
       // Create Session in DB
       try {
         const sid = await supportService.createSession(user.id, user.name);
         setActiveSessionId(sid);
       } catch (e) {
         console.error(e);
       }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !activeSessionId) return;

    try {
      await supportService.sendMessage(activeSessionId, user.id, user.name, input, false);
      setInput('');
    } catch (e) {
      console.error(e);
    }
  };

  // Initial Bot Welcome
  useEffect(() => {
    if (isOpen && isBotMode && messages.length === 0) {
      setMessages([
        { 
          id: 'welcome', 
          senderId: 'bot', 
          senderName: 'Assistant', 
          text: 'مرحباً بك في فليكس ديزاين! 👋 كيف يمكنني مساعدتك اليوم؟', 
          timestamp: new Date().toISOString(),
          isAdmin: true
        }
      ]);
    }
  }, [isOpen, isBotMode]);

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-gradient-to-r from-primary to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform animate-float"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[60] w-[350px] h-[500px] bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-indigo-600 p-4 flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                {isBotMode ? <Bot size={20} /> : <UserIcon size={20} />}
             </div>
             <div>
               <h3 className="font-bold text-white text-sm">
                 {isBotMode ? 'المساعد الذكي' : 'خدمة العملاء'}
               </h3>
               <div className="text-[10px] text-indigo-100 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                 متصل الآن
               </div>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-transparent">
             {messages.map((msg) => {
               const isMe = msg.senderId === 'user' || (user && msg.senderId === user.id);
               return (
                 <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      isMe 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
                    }`}>
                       {msg.text}
                    </div>
                 </div>
               );
             })}
             
             {/* Bot Options */}
             {isBotMode && (
               <div className="flex flex-col gap-2 mt-4 animate-fade-in">
                 {botOptions.map(opt => (
                   <button 
                     key={opt.id}
                     onClick={() => handleBotOption(opt.id)}
                     className="bg-white dark:bg-white/5 border border-primary/20 text-primary dark:text-indigo-300 py-2 px-4 rounded-xl text-sm hover:bg-primary/5 transition-colors text-right"
                   >
                     {opt.label} <ChevronLeft size={14} className="inline float-left mt-1" />
                   </button>
                 ))}
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black/20">
             {isBotMode ? (
               <div className="text-center text-xs text-slate-400 py-2">
                 اختر أحد الخيارات أعلاه للمتابعة
               </div>
             ) : (
               <form onSubmit={handleSendMessage} className="flex gap-2">
                 <input 
                   type="text" 
                   value={input} 
                   onChange={e => setInput(e.target.value)}
                   placeholder="اكتب رسالتك..."
                   className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none dark:text-white"
                 />
                 <button 
                   type="submit" 
                   disabled={!input.trim()}
                   className="bg-primary hover:bg-indigo-600 text-white p-2 rounded-xl disabled:opacity-50 transition-colors"
                 >
                   <Send size={18} />
                 </button>
               </form>
             )}
          </div>
        </div>
      )}
    </>
  );
};