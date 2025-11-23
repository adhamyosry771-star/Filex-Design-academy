
import React, { useState, useEffect } from 'react';
import { User, Notification, Announcement } from '../types';
import { notificationService, announcementService } from '../services/mockDb';
import { Bell, Megaphone, ShieldCheck, Clock, CheckCircle2, AlertCircle, Info, MailOpen } from 'lucide-react';

interface UserMessagesProps {
  user: User;
  t: any;
}

export const UserMessages: React.FC<UserMessagesProps> = ({ user, t }) => {
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'OFFICIAL'>('OFFICIAL');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      // Subscribe to notifications
      const unsubNotifs = notificationService.getUserNotifications(user.id, (data) => {
        setNotifications(data);
      });

      // Subscribe to announcements
      const unsubAnnounce = announcementService.getAnnouncements((data) => {
        setAnnouncements(data);
        setLoading(false);
      });

      // Subscribe to read status for announcements
      const unsubReadIds = announcementService.getReadIds(user.id, (ids) => {
        setReadAnnouncementIds(ids);
      });

      return () => {
        unsubNotifs();
        unsubAnnounce();
        unsubReadIds();
      };
    };

    fetchData();
  }, [user.id]);

  // Effect to handle marking as read when entering tabs
  useEffect(() => {
    if (activeTab === 'SYSTEM') {
      const unreadNotifs = notifications.filter(n => !n.isRead);
      if (unreadNotifs.length > 0) {
        notificationService.markAllAsRead(user.id);
      }
    } else if (activeTab === 'OFFICIAL') {
      const unreadAnnouncements = announcements.filter(a => !readAnnouncementIds.has(a.id));
      if (unreadAnnouncements.length > 0) {
        unreadAnnouncements.forEach(a => {
           announcementService.markAsRead(user.id, a.id);
        });
      }
    }
  }, [activeTab, notifications, announcements, readAnnouncementIds, user.id]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500" />;
      case 'error': return <AlertCircle className="text-red-500" />;
      case 'warning': return <AlertCircle className="text-amber-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  const unreadSystemCount = notifications.filter(n => !n.isRead).length;
  const unreadOfficialCount = announcements.filter(a => !readAnnouncementIds.has(a.id)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in relative z-10">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden min-h-[600px] flex flex-col transition-colors duration-300">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-black/20 p-8 border-b border-slate-200 dark:border-white/10 flex items-center gap-4">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <MailOpen size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.inbox}</h2>
             <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
          <button
            onClick={() => setActiveTab('OFFICIAL')}
            className={`flex-1 py-4 text-center font-bold text-sm transition-all relative ${
              activeTab === 'OFFICIAL' 
                ? 'text-primary bg-slate-50 dark:bg-white/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Megaphone size={18} />
              {t.official}
              {unreadOfficialCount > 0 && <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{unreadOfficialCount}</span>}
            </div>
            {activeTab === 'OFFICIAL' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>

          <button
            onClick={() => setActiveTab('SYSTEM')}
            className={`flex-1 py-4 text-center font-bold text-sm transition-all relative ${
              activeTab === 'SYSTEM' 
                ? 'text-primary bg-slate-50 dark:bg-white/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bell size={18} />
              {t.system}
              {unreadSystemCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadSystemCount}</span>}
            </div>
            {activeTab === 'SYSTEM' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-[#0f172a]/50">
          
          {/* OFFICIAL MESSAGES */}
          {activeTab === 'OFFICIAL' && (
            <div className="space-y-6">
              {announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Megaphone size={48} className="mb-4 opacity-20" />
                  <p>{t.noOfficial}</p>
                </div>
              ) : (
                announcements.map((ann) => {
                  const isUnread = !readAnnouncementIds.has(ann.id);
                  return (
                    <div key={ann.id} className={`bg-white dark:bg-white/5 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group ${isUnread ? 'border-primary/40 bg-indigo-50/20 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-white/10'}`}>
                      {isUnread && <div className="absolute top-0 right-0 w-1 h-full bg-primary animate-pulse"></div>}
                      <div className="flex items-start gap-4">
                        <div className="mt-1 bg-amber-100 dark:bg-amber-500/20 p-3 rounded-xl text-amber-600 dark:text-amber-500">
                          <ShieldCheck size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                               <h3 className={`text-lg ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>{ann.title}</h3>
                               {isUnread && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{t.new}</span>}
                             </div>
                             <span className="text-xs text-slate-400 font-mono bg-slate-100 dark:bg-black/20 px-2 py-1 rounded">
                               {new Date(ann.createdAt).toLocaleDateString('ar-EG')}
                             </span>
                          </div>
                          <div className="text-sm text-primary font-medium mb-3 flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                             {t.sentBy}: {ann.createdBy}
                          </div>
                          <div className={`text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 ${isUnread ? 'text-slate-900 dark:text-white' : ''}`}>
                            {ann.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SYSTEM MESSAGES */}
          {activeTab === 'SYSTEM' && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Bell size={48} className="mb-4 opacity-20" />
                  <p>{t.noSystem}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    className={`bg-white dark:bg-white/5 border rounded-2xl p-5 transition-all cursor-default ${!notif.isRead ? 'border-primary/50 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-white/10 opacity-90 hover:opacity-100'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-full ${!notif.isRead ? 'bg-white dark:bg-white/10 shadow-sm' : 'bg-slate-100 dark:bg-white/5'}`}>
                        {getIconByType(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className={`text-base ${!notif.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                            {notif.title}
                          </h3>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(notif.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.isRead && (
                         <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
