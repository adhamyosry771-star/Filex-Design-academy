

import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { supportService } from '../services/mockDb';
import { Send, User as UserIcon, Bot, ChevronLeft, Loader2, Headphones, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface LiveSupportProps {
  user: User | null;
  t: any;
}

export const LiveSupport: React.FC<LiveSupportProps> = ({ user, t }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isBotMode, setIsBotMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSessionClosed, setIsSessionClosed] = useState(false);
  
  // Bot predefined flows - Translatable via props mapping
  const botOptions = [
    { id: 'pricing', label: t.botOptions.pricing },
    { id: 'services', label: t.botOptions.services },
    { id: 'human', label: t.botOptions.human },
  ];

  // Check for active session on load
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const unsub = supportService.getUserActiveSession(user.id, (sessionId) => {
        if (sessionId) {
          setActiveSessionId(sessionId);
          setIsBotMode(false);
          setIsSessionClosed(false);
        } else {
          // If we had a session ID but now it's null, it means it was closed by admin
          if (activeSessionId) {
            setIsSessionClosed(true);
          }
          setActiveSessionId(null);
        }
        setIsLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  // Load messages if session active
  useEffect(() => {
    if (activeSessionId) {
      const unsub = supportService.getMessages(activeSessionId, (msgs) => {
        setMessages(msgs);
        setTimeout(scrollToBottom, 100);
      });
      return () => unsub();
    }
  }, [activeSessionId]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  };

  const handleBotOption = async (optionId: string) => {
    // Add user selection as a fake message to the view
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), senderId: 'user', senderName: 'Me', text: '', timestamp: new Date().toISOString(), isAdmin: false 
    };
    
    // Add bot response locally
    let botResponseText = '';

    if (optionId === 'pricing') {
       userMsg.text = t.botOptions.pricing;
       botResponseText = t.botResponses.pricing;
       setMessages(prev => [...prev, userMsg, { ...userMsg, id: 'bot-'+Date.now(), senderId: 'bot', senderName: 'Bot', text: botResponseText, isAdmin: true }]);
       setTimeout(scrollToBottom, 100);
    } else if (optionId === 'services') {
       userMsg.text = t.botOptions.services;
       botResponseText = t.botResponses.services;
       setMessages(prev => [...prev, userMsg, { ...userMsg, id: 'bot-'+Date.now(), senderId: 'bot', senderName: 'Bot', text: botResponseText, isAdmin: true }]);
       setTimeout(scrollToBottom, 100);
    } else if (optionId === 'human') {
       if (!user) {
         setMessages(prev => [...prev, { ...userMsg, id: 'bot-err', senderId: 'bot', senderName: 'Bot', text: t.botResponses.humanErr, isAdmin: true }]);
         return;
       }
       
       // Show the waiting message immediately
       userMsg.text = t.botOptions.human;
       botResponseText = t.botResponses.connectMsg; // "برجاء الانتظار..."
       setMessages(prev => [...prev, userMsg, { ...userMsg, id: 'bot-'+Date.now(), senderId: 'bot', senderName: 'Bot', text: botResponseText, isAdmin: true }]);
       setTimeout(scrollToBottom, 100);

       setIsBotMode(false);
       setIsLoading(true);
       try {
         const sid = await supportService.createSession(user.id, user.name);
         setActiveSessionId(sid);
       } catch (e) {
         console.error(e);
       } finally {
         setIsLoading(false);
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
    if (isBotMode && messages.length === 0 && !activeSessionId && !isSessionClosed) {
      setMessages([
        { 
          id: 'welcome', 
          senderId: 'bot', 
          senderName: 'Assistant', 
          text: t.botResponses.welcome, 
          timestamp: new Date().toISOString(),
          isAdmin: true
        }
      ]);
    }
  }, [isBotMode, activeSessionId, isSessionClosed, t]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 max-w-md w-full">
           <Headphones size={48} className="mx-auto text-slate-400 mb-4" />
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.title}</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-6">{t.loginReq}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] animate-fade-in relative z-10 flex flex-col">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col flex-1 transition-colors duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-indigo-600 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                 {isBotMode ? <Bot size={28} /> : <Headphones size={28} />}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {isBotMode ? t.botName : t.title}
                </h3>
                <div className="text-xs text-indigo-100 flex items-center gap-1.5 opacity-90">
                  <span className={`w-2 h-2 rounded-full ${isBotMode ? 'bg-blue-300' : 'bg-green-400 animate-pulse'}`}></span>
                  {isBotMode ? t.botLabel : t.agentLabel}
                </div>
              </div>
           </div>
        </div>

        {/* Content Area */}
        {isSessionClosed ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-transparent">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6">
                 <Bot size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.sessionClosed}</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                {t.closedDesc}
              </p>
              <Button onClick={() => { setIsSessionClosed(false); setIsBotMode(true); setMessages([]); setActiveSessionId(null); }}>
                {t.newChat}
              </Button>
           </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-[#0f172a]/40" ref={chatContainerRef}>
              {isLoading && (
                 <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                 </div>
              )}
              
              {messages.map((msg, idx) => {
                 const isMe = msg.senderId === 'user' || msg.senderId === user.id;
                 return (
                   <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                      <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                         <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                           isMe 
                             ? 'bg-primary text-white rounded-br-none' 
                             : 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white rounded-bl-none'
                         }`}>
                            {msg.text}
                         </div>
                         <span className="text-[10px] text-slate-400 mt-1 px-1">
                           {msg.senderName === 'Bot' ? t.botName : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}
                         </span>
                      </div>
                   </div>
                 );
               })}
               
               {/* Bot Options */}
               {isBotMode && (
                 <div className="flex flex-wrap gap-2 mt-4 animate-fade-in max-w-[80%]">
                   {botOptions.map(opt => (
                     <button 
                       key={opt.id}
                       onClick={() => handleBotOption(opt.id)}
                       className="bg-white dark:bg-white/5 border border-primary/20 hover:border-primary text-primary dark:text-indigo-300 py-3 px-5 rounded-xl text-sm hover:bg-primary/5 transition-all shadow-sm"
                     >
                       {opt.label}
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-black/20 border-t border-slate-200 dark:border-white/10">
               {isBotMode ? (
                 <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                   {t.chooseOption}
                 </div>
               ) : (
                 <form onSubmit={handleSendMessage} className="flex gap-3">
                   <input 
                     type="text" 
                     value={input} 
                     onChange={e => setInput(e.target.value)}
                     placeholder={t.placeholder}
                     className="flex-1 bg-slate-100 dark:bg-white/5 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-black/40 rounded-xl px-5 py-3 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                   />
                   <button 
                     type="submit" 
                     disabled={!input.trim()}
                     className="bg-primary hover:bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/30"
                   >
                     <Send size={24} />
                   </button>
                 </form>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};