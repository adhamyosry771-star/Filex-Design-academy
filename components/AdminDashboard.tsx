
import React, { useEffect, useState, useRef } from 'react';
import { User, DesignRequest, RequestStatus, Message, Banner, SupportSession, ChatMessage } from '../types';
import { requestService, authService, notificationService, announcementService, supportService, systemService } from '../services/mockDb';
import { ShieldCheck, Package, MessageSquare, Users, Layout, Clock, CheckCircle2, Loader2, XCircle, Trash2, Eye, EyeOff, Plus, Activity, Upload, Lock, Unlock, UserPlus, Megaphone, Send, Headphones, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface AdminDashboardProps {
  user: User;
}

type TabType = 'REQUESTS' | 'MESSAGES' | 'USERS' | 'BANNERS' | 'ADMINS' | 'OFFICIAL_MESSAGES' | 'LIVE_SUPPORT';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('REQUESTS');
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Live Support State
  const [supportSessions, setSupportSessions] = useState<SupportSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [adminChatInput, setAdminChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // New Banner State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Management State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Official Messages State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);
  
  // System Reset State
  const [isResettingSystem, setIsResettingSystem] = useState(false);

  const isSuperAdmin = user.email.toLowerCase() === 'filex@flexdesign.academy';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allRequests, allMessages, allUsers, allBanners] = await Promise.all([
        requestService.getAllRequests(),
        requestService.getMessages(),
        authService.getAllUsers(),
        requestService.getBanners(false)
      ]);
      
      setRequests(allRequests);
      setMessages(allMessages);
      setUsers(allUsers);
      setBanners(allBanners);
    } catch (e) {
      console.error("Admin fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen to Support Sessions
  useEffect(() => {
    const unsub = supportService.getAdminSessions(user, (sessions) => {
      setSupportSessions(sessions);
    });
    return () => unsub();
  }, [user]);

  // Listen to Active Chat Messages
  useEffect(() => {
    if (activeChatId) {
      const unsub = supportService.getMessages(activeChatId, (msgs) => {
        setChatMessages(msgs);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
      return () => unsub();
    }
  }, [activeChatId]);

  const handleAdminSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim() || !activeChatId) return;
    try {
      await supportService.sendMessage(activeChatId, user.id, user.name, adminChatInput, true);
      setAdminChatInput('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleEndChat = async (sessionId: string) => {
    if (window.confirm("هل أنت متأكد من إنهاء هذه المحادثة؟")) {
      // إغلاق فوري للواجهة (Optimistic Update)
      if (activeChatId === sessionId) {
         setActiveChatId(null);
         setChatMessages([]);
      }
      
      // تنفيذ العملية في الخلفية
      try {
        await supportService.endSession(sessionId);
      } catch (error) {
        console.error("Error ending session", error);
      }
    }
  };

  const handleStatusChange = async (requestId: string, userId: string | undefined, newStatus: RequestStatus) => {
    await requestService.updateRequestStatus(requestId, newStatus);
    
    // إرسال إشعار للمستخدم بالنصوص المخصصة المطلوبة
    if (userId) {
      let title = '';
      let msg = '';
      let type: 'info' | 'success' | 'warning' | 'error' = 'info';

      switch (newStatus) {
        case 'PENDING': // Or conceptually "Received"
           // This case is usually set on creation, but if admin resets it:
           title = 'تحديث حالة الطلب';
           msg = 'تم استلام طلبكم وهو حالياً قيد الانتظار.';
           type = 'info';
           break;
        case 'IN_PROGRESS':
          title = 'تحديث حالة الطلب';
          msg = 'جاري العمل على طلبكم الآن.';
          type = 'info';
          break;
        case 'COMPLETED':
          title = 'مبروك!';
          msg = 'تم الانتهاء من الطلب الخاص بكم بنجاح.';
          type = 'success';
          break;
        case 'REJECTED':
          title = 'تحديث حالة الطلب';
          msg = 'تم رفض الطلب الخاص بكم.';
          type = 'error';
          break;
      }
      
      if (title) {
        await notificationService.createNotification(userId, title, msg, type);
      }
    }

    fetchData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      await authService.deleteUser(userId);
      fetchData();
    }
  };

  const handleToggleBanUser = async (userId: string, currentStatus?: 'ACTIVE' | 'BANNED') => {
    const action = currentStatus === 'BANNED' ? 'فك حظر' : 'حظر';
    if (window.confirm(`هل أنت متأكد من ${action} هذا المستخدم؟`)) {
      await authService.toggleUserBan(userId, currentStatus);
      fetchData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newBannerTitle) return;

    setIsUploading(true);
    try {
      const imageUrl = await requestService.uploadBannerImage(selectedFile);
      await requestService.addBanner(imageUrl, newBannerTitle);
      
      setNewBannerTitle('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      await fetchData();
      alert("تم نشر البنر بنجاح!");
    } catch (error) {
      console.error("Error uploading banner", error);
      alert(error instanceof Error ? error.message : "فشل رفع الصورة.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleBanner = async (id: string, currentStatus: boolean) => {
    await requestService.toggleBannerStatus(id, currentStatus);
    fetchData();
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm("حذف هذا البنر؟")) {
      await requestService.deleteBanner(id);
      fetchData();
    }
  };

  // Admin Management Functions
  const handleCreateDefaultAdmins = async () => {
    if (!window.confirm("سيتم إنشاء 4 حسابات إدارية افتراضية. هل تريد المتابعة؟")) return;
    
    setIsCreatingAdmin(true);
    try {
      const defaultAdmins = [
        { name: 'Farida', email: 'farida@flexdesign.academy' },
        { name: 'Admin 1', email: 'admin1@flexdesign.academy' },
        { name: 'Admin 2', email: 'admin2@flexdesign.academy' },
        { name: 'Admin 3', email: 'admin3@flexdesign.academy' },
      ];

      for (const admin of defaultAdmins) {
        await authService.createAdminAccount(admin.name, admin.email, 'FlexAdmin2024');
      }
      
      alert("تم إنشاء الحسابات بنجاح! كلمة المرور الموحدة هي: FlexAdmin2024");
      fetchData();
    } catch (error) {
      alert("حدث خطأ أثناء الإنشاء. ربما الحسابات موجودة بالفعل.");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleCreateCustomAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAdmin(true);
    try {
      await authService.createAdminAccount(newAdminName, newAdminEmail, newAdminPassword);
      alert("تم إنشاء المشرف بنجاح");
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      fetchData();
    } catch (error) {
       alert("فشل إنشاء الحساب");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementBody) return;

    setIsSendingAnnouncement(true);
    try {
      await announcementService.createAnnouncement(announcementTitle, announcementBody, user.name);
      alert("تم إرسال الرسالة الرسمية لجميع المستخدمين.");
      setAnnouncementTitle('');
      setAnnouncementBody('');
    } catch (error) {
      alert("حدث خطأ أثناء الإرسال");
    } finally {
      setIsSendingAnnouncement(false);
    }
  };
  
  const handleSystemReset = async () => {
    const confirm1 = window.confirm("⚠️ تحذير شديد الخطورة!\n\nهذا الإجراء سيقوم بحذف كافة:\n- الطلبات\n- الرسائل\n- المحادثات\n- الإشعارات\n\nلن تتأثر حسابات المستخدمين.\nهل أنت متأكد تماماً؟");
    if (!confirm1) return;
    
    const confirm2 = window.confirm("هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه مطلقاً وسيتم مسح البيانات فوراً.");
    if (!confirm2) return;

    setIsResettingSystem(true);
    try {
      await systemService.resetAllSystemData();
      alert("تم تصفير النظام بنجاح. الموقع جاهز الآن للانطلاق النظيف. 🚀");
      fetchData();
    } catch (e) {
      alert("حدث خطأ أثناء التصفير. تأكد من صلاحياتك.");
    } finally {
      setIsResettingSystem(false);
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20';
      case 'IN_PROGRESS': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20';
      case 'COMPLETED': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 border-green-200 dark:border-green-400/20';
      case 'REJECTED': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
    }
  };

  const adminUsers = users.filter(u => u.role === 'ADMIN');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in relative z-10">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
             <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">المستخدمين</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{users.length}</div>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-xl text-indigo-600 dark:text-indigo-400"><Users size={24} /></div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
             <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">الطلبات</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{requests.length}</div>
          </div>
          <div className="bg-amber-100 dark:bg-amber-500/20 p-3 rounded-xl text-amber-600 dark:text-amber-400"><Package size={24} /></div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
             <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">الرسائل</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{messages.length}</div>
          </div>
          <div className="bg-pink-100 dark:bg-pink-500/20 p-3 rounded-xl text-pink-600 dark:text-pink-400"><MessageSquare size={24} /></div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
             <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">البنرات النشطة</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{banners.filter(b => b.isActive).length}</div>
          </div>
          <div className="bg-cyan-100 dark:bg-cyan-500/20 p-3 rounded-xl text-cyan-600 dark:text-cyan-400"><Layout size={24} /></div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden min-h-[800px] flex flex-col lg:flex-row transition-colors duration-300">
        
        {/* Admin Sidebar */}
        <div className="lg:w-72 bg-slate-100 dark:bg-[#050914]/50 border-l border-slate-200 dark:border-white/5 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-white text-lg">لوحة المدير</div>
              <div className="text-xs text-amber-600 dark:text-amber-500 font-medium tracking-wider">ADMIN PANEL</div>
            </div>
          </div>

          <nav className="space-y-2 flex-1 overflow-x-auto lg:overflow-visible flex lg:block gap-2 pb-4 lg:pb-0">
             {/* Live Support Tab */}
             <button
              onClick={() => setActiveTab('LIVE_SUPPORT')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'LIVE_SUPPORT' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Headphones size={20} className={activeTab === 'LIVE_SUPPORT' ? 'animate-pulse' : ''} />
                <span>الدعم المباشر</span>
              </div>
              {supportSessions.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{supportSessions.length}</span>}
            </button>

            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'REQUESTS' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Package size={20} />
                <span>كل الطلبات</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'USERS' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                <span>المستخدمين</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('BANNERS')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'BANNERS' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Layout size={20} />
                <span>إدارة البنرات</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('OFFICIAL_MESSAGES')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'OFFICIAL_MESSAGES' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Megaphone size={20} className="text-primary" />
                <span>رسائل رسمية</span>
              </div>
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('ADMINS')}
                className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'ADMINS' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-amber-500" />
                  <span>إدارة المشرفين</span>
                </div>
              </button>
            )}

            <button
              onClick={() => setActiveTab('MESSAGES')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'MESSAGES' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} />
                <span>رسائل العملاء</span>
              </div>
              <span className="bg-slate-200 dark:bg-white/10 text-xs py-1 px-2 rounded-md">{messages.length}</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/5 hidden lg:block">
             <div className="flex items-center gap-2 text-slate-500 justify-center text-sm">
                <Activity size={14} className="animate-pulse text-green-500" />
                <span>النظام يعمل بكفاءة</span>
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-slate-50 dark:bg-[#0f172a]/30 overflow-y-auto max-h-[900px]">
          
          {/* --- LIVE SUPPORT TAB --- */}
          {activeTab === 'LIVE_SUPPORT' && (
            <div className="h-full flex flex-col md:flex-row">
               {/* Sessions List */}
               <div className="w-full md:w-80 border-l border-slate-200 dark:border-white/10 overflow-y-auto bg-white dark:bg-black/20">
                  <div className="p-4 border-b border-slate-200 dark:border-white/10">
                     <h3 className="font-bold text-slate-700 dark:text-white">المحادثات النشطة</h3>
                  </div>
                  {supportSessions.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">لا توجد محادثات نشطة حالياً</div>
                  ) : (
                    supportSessions.map(session => (
                       <button
                         key={session.id}
                         onClick={() => setActiveChatId(session.id)}
                         className={`w-full p-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-right ${activeChatId === session.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-r-4 border-r-indigo-500' : ''}`}
                       >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                             {session.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="font-bold text-slate-800 dark:text-white text-sm truncate">{session.userName}</div>
                             <div className="text-xs text-slate-400 truncate">
                               {new Date(session.lastMessageAt).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
                             </div>
                          </div>
                       </button>
                    ))
                  )}
               </div>

               {/* Chat Window */}
               <div className="flex-1 flex flex-col bg-slate-100 dark:bg-black/40">
                  {activeChatId ? (
                     <>
                        <div className="p-4 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                           <div className="font-bold text-slate-800 dark:text-white">
                              محادثة مع: {supportSessions.find(s => s.id === activeChatId)?.userName}
                           </div>
                           <Button 
                             onClick={() => handleEndChat(activeChatId)}
                             variant="secondary"
                             className="!px-3 !py-1 text-xs bg-red-500 hover:bg-red-600 border-none text-white"
                           >
                             إنهاء المحادثة
                           </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                           {chatMessages.map(msg => {
                              const isMe = msg.isAdmin;
                              return (
                                 <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-white/10 text-slate-800 dark:text-white'}`}>
                                       {!isMe && <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{msg.senderName}</div>}
                                       {msg.text}
                                    </div>
                                 </div>
                              );
                           })}
                           <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/10">
                           <form onSubmit={handleAdminSendMessage} className="flex gap-2">
                              <input 
                                type="text" 
                                value={adminChatInput}
                                onChange={e => setAdminChatInput(e.target.value)}
                                className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 outline-none dark:text-white"
                                placeholder="اكتب ردك هنا..."
                              />
                              <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl">
                                 <Send size={20} />
                              </button>
                           </form>
                        </div>
                     </>
                  ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <Headphones size={48} className="mb-4 opacity-20" />
                        <p>اختر محادثة من القائمة للبدء</p>
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* --- REQUESTS TAB --- */}
          {activeTab === 'REQUESTS' && (
            <div className="p-4 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">إدارة الطلبات الواردة</h2>
                <button onClick={fetchData} className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-primary dark:hover:text-white transition-colors">
                  <Loader2 size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/10 shadow-sm">
                <table className="w-full text-right border-collapse min-w-[900px]">
                  <thead>
                    <tr className="text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                      <th className="py-4 px-6 font-medium whitespace-nowrap">العميل</th>
                      <th className="py-4 px-4 font-medium whitespace-nowrap">نوع المشروع</th>
                      <th className="py-4 px-4 font-medium min-w-[250px]">الوصف</th>
                      <th className="py-4 px-4 font-medium whitespace-nowrap">الحالة</th>
                      <th className="py-4 px-6 font-medium whitespace-nowrap">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-200">
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-6 align-top">
                          <div className="font-bold text-slate-800 dark:text-white text-base">{req.clientName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{req.email}</div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg text-sm font-medium inline-block whitespace-nowrap">
                            {req.projectType}
                          </span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-slate-200 dark:border-white/5">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3" title={req.description}>{req.description}</p>
                            {req.budget && <div className="text-xs text-green-600 dark:text-green-400 mt-2 font-mono">💰 الميزانية: {req.budget}</div>}
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex w-fit items-center gap-1.5 whitespace-nowrap ${getStatusColor(req.status)}`}>
                            {req.status === 'PENDING' ? 'قيد المراجعة' : 
                             req.status === 'IN_PROGRESS' ? 'جاري العمل' :
                             req.status === 'COMPLETED' ? 'مكتمل' : 'مرفوض'}
                          </span>
                        </td>
                        <td className="py-4 px-6 align-top">
                          <div className="flex gap-2">
                             <button onClick={() => handleStatusChange(req.id, req.userId, 'PENDING')} className="p-2 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white rounded-lg transition-all" title="استلام / قيد الانتظار"><Clock size={18} /></button>
                            <button onClick={() => handleStatusChange(req.id, req.userId, 'IN_PROGRESS')} className="p-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all" title="جاري العمل"><Loader2 size={18} /></button>
                            <button onClick={() => handleStatusChange(req.id, req.userId, 'COMPLETED')} className="p-2 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all" title="اكتمال"><CheckCircle2 size={18} /></button>
                            <button onClick={() => handleStatusChange(req.id, req.userId, 'REJECTED')} className="p-2 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="رفض"><XCircle size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-500">لا توجد طلبات لعرضها</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- OFFICIAL MESSAGES TAB --- */}
          {activeTab === 'OFFICIAL_MESSAGES' && (
             <div className="p-8">
               <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">رسائل رسمية للمستخدمين</h2>
               <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl mb-8">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                     <Megaphone size={20} className="text-primary" />
                     إرسال رسالة جديدة للجميع
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                    هذه الرسالة ستظهر لجميع مستخدمي الموقع في خانة "رسائل رسمية". استخدمها للإعلانات الهامة.
                  </p>
                  
                  <form onSubmit={handleSendAnnouncement} className="space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">عنوان الرسالة</label>
                        <input 
                          type="text" 
                          required
                          value={announcementTitle}
                          onChange={e => setAnnouncementTitle(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:border-primary text-slate-900 dark:text-white"
                          placeholder="مثال: خصومات الجمعة البيضاء"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">نص الرسالة</label>
                        <textarea 
                          required
                          rows={4}
                          value={announcementBody}
                          onChange={e => setAnnouncementBody(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:border-primary text-slate-900 dark:text-white"
                          placeholder="اكتب تفاصيل الرسالة الرسمية هنا..."
                        />
                     </div>
                     <Button type="submit" isLoading={isSendingAnnouncement} icon={<Send size={18} />}>
                       نشر الرسالة الرسمية
                     </Button>
                  </form>
               </div>
             </div>
          )}

          {/* --- ADMINS MANAGEMENT TAB (SUPER ADMIN ONLY) --- */}
          {activeTab === 'ADMINS' && isSuperAdmin && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">إدارة المشرفين وصلاحيات الوصول</h2>
              
              {/* Default Setup Button */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-500/20 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div>
                    <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400">الإعداد السريع للطاقم</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500/80">إنشاء حسابات المشرفين الافتراضية (Farida, Admin 1, Admin 2, Admin 3) بضغطة واحدة.</p>
                 </div>
                 <Button onClick={handleCreateDefaultAdmins} isLoading={isCreatingAdmin} className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white border-none shadow-lg shadow-amber-600/20">
                   إنشاء طاقم الإدارة الافتراضي
                 </Button>
              </div>

              {/* Create Custom Admin Form */}
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl mb-8">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                   <UserPlus size={20} className="text-primary" />
                   إضافة مشرف جديد
                 </h3>
                 <form onSubmit={handleCreateCustomAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                       <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1 block">الاسم</label>
                       <input 
                         type="text" 
                         value={newAdminName} 
                         onChange={e => setNewAdminName(e.target.value)}
                         className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:border-primary text-slate-900 dark:text-white"
                         placeholder="اسم المشرف"
                         required
                       />
                    </div>
                    <div>
                       <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1 block">البريد الإلكتروني</label>
                       <input 
                         type="email" 
                         value={newAdminEmail} 
                         onChange={e => setNewAdminEmail(e.target.value)}
                         className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:border-primary text-slate-900 dark:text-white"
                         placeholder="admin@example.com"
                         required
                       />
                    </div>
                    <div>
                       <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1 block">كلمة المرور</label>
                       <input 
                         type="password" 
                         value={newAdminPassword} 
                         onChange={e => setNewAdminPassword(e.target.value)}
                         className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:border-primary text-slate-900 dark:text-white"
                         placeholder="******"
                         required
                         minLength={6}
                       />
                    </div>
                    <div className="md:col-span-3 mt-2">
                       <Button type="submit" isLoading={isCreatingAdmin} className="w-full">إضافة المشرف</Button>
                    </div>
                 </form>
              </div>

              {/* Admin List */}
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">قائمة المشرفين الحاليين</h3>
              <div className="grid gap-4 mb-8">
                 {adminUsers.map(admin => (
                   <div key={admin.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500 font-bold">
                            {admin.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <div className="font-bold text-slate-800 dark:text-white">{admin.name}</div>
                            <div className="text-sm text-slate-500">{admin.email}</div>
                         </div>
                      </div>
                      {admin.email !== user.email && (
                         <button 
                           onClick={() => handleDeleteUser(admin.id)}
                           className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                           title="حذف المشرف"
                         >
                            <Trash2 size={18} />
                         </button>
                      )}
                   </div>
                 ))}
              </div>
              
              {/* DANGER ZONE */}
              <div className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 mt-12">
                 <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle size={24} />
                    منطقة الخطر
                 </h3>
                 <p className="text-red-800 dark:text-red-300 mb-6 text-sm">
                    الإجراءات في هذا القسم حرجة جداً ولا يمكن التراجع عنها. يرجى توخي الحذر الشديد.
                 </p>
                 
                 <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-black/20 rounded-xl border border-red-100 dark:border-red-900/30">
                    <div>
                       <h4 className="font-bold text-slate-800 dark:text-white">تصفير النظام وحذف كافة البيانات</h4>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                          سيتم حذف جميع (الطلبات، الرسائل، الإشعارات، المحادثات، الإعلانات الرسمية) بشكل نهائي. لن يتم حذف حسابات المستخدمين أو المدراء.
                       </p>
                    </div>
                    <Button 
                       onClick={handleSystemReset}
                       isLoading={isResettingSystem}
                       className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-600/20 whitespace-nowrap"
                    >
                       حذف كل البيانات الآن
                    </Button>
                 </div>
              </div>
            </div>
          )}

          {/* --- USERS TAB --- */}
          {activeTab === 'USERS' && (
            <div className="p-4 md:p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">المستخدمين المسجلين ({users.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {users.map((u) => (
                  <div key={u.id} className={`bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group shadow-sm ${u.status === 'BANNED' ? 'opacity-70 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : ''}`}>
                     {/* User Info Section */}
                     <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 relative shadow-lg">
                           {u.name.charAt(0).toUpperCase()}
                           {u.status === 'BANNED' && <div className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"><XCircle size={12} /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                           <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                             <span className="truncate" title={u.name}>{u.name}</span>
                             {u.status === 'BANNED' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full shrink-0">محظور</span>}
                             {u.role === 'ADMIN' && <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">مدير</span>}
                           </div>
                           <div className="text-sm text-slate-500 dark:text-slate-400 truncate font-mono" title={u.email}>{u.email}</div>
                        </div>
                     </div>

                     {/* Actions & Meta Section */}
                     <div className="flex items-center justify-between w-full md:w-auto gap-4 md:pl-4 mt-2 md:mt-0 border-t border-slate-100 dark:border-white/5 md:border-none pt-4 md:pt-0">
                        <div className="text-xs text-slate-500 flex items-center gap-2 bg-slate-100 dark:bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap">
                           <Clock size={12} />
                           {new Date(u.joinedAt).toLocaleDateString('ar-EG')}
                        </div>
                        
                        {u.role !== 'ADMIN' && (
                           <div className="flex gap-2 shrink-0">
                             <button 
                                onClick={() => handleToggleBanUser(u.id, u.status)}
                                className={`p-2 rounded-lg transition-colors border ${u.status === 'BANNED' ? 'bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white' : 'bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white'}`}
                                title={u.status === 'BANNED' ? "فك الحظر" : "حظر المستخدم"}
                             >
                                {u.status === 'BANNED' ? <Unlock size={18} /> : <Lock size={18} />}
                             </button>
                             <button 
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 hover:bg-red-500 hover:text-white bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-colors" 
                                title="حذف المستخدم"
                             >
                                <Trash2 size={18} />
                             </button>
                           </div>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- BANNERS TAB --- */}
          {activeTab === 'BANNERS' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">إدارة بنرات الإعلانات</h2>
              
              <form onSubmit={handleAddBanner} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl mb-8 shadow-sm">
                 <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
                    <Plus size={18} /> إضافة بنر جديد
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input 
                       type="text" 
                       placeholder="عنوان البنر"
                       className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-primary"
                       value={newBannerTitle}
                       onChange={(e) => setNewBannerTitle(e.target.value)}
                       required
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        id="banner-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                        required
                      />
                      <label 
                        htmlFor="banner-upload" 
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-colors ${selectedFile ? 'bg-green-100 dark:bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-black/20 border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary'}`}
                      >
                        <Upload size={18} />
                        {selectedFile ? selectedFile.name : 'اضغط لرفع صورة من الجهاز'}
                      </label>
                    </div>
                 </div>
                 <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full md:w-auto"
                    isLoading={isUploading}
                    disabled={!selectedFile || !newBannerTitle}
                 >
                   {isUploading ? 'جاري الرفع...' : 'نشر البنر'}
                 </Button>
              </form>

              <div className="space-y-4">
                 {banners.map((banner) => (
                    <div key={banner.id} className={`relative rounded-xl overflow-hidden border ${banner.isActive ? 'border-primary/50' : 'border-slate-200 dark:border-white/10 opacity-70'}`}>
                       <div className="h-32 w-full relative">
                          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-6">
                             <div>
                                <h4 className="text-xl font-bold text-white">{banner.title}</h4>
                                <div className={`text-xs mt-1 ${banner.isActive ? 'text-green-400' : 'text-slate-400'}`}>
                                   {banner.isActive ? 'نشط' : 'غير نشط'}
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="absolute top-4 left-4 flex gap-2">
                          <button 
                             onClick={() => handleToggleBanner(banner.id, banner.isActive)}
                             className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors"
                          >
                             {banner.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button 
                             onClick={() => handleDeleteBanner(banner.id)}
                             className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                 ))}
                 {banners.length === 0 && <div className="text-center text-slate-500 py-8">لا توجد بنرات حالياً</div>}
              </div>
            </div>
          )}

          {/* --- MESSAGES TAB --- */}
          {activeTab === 'MESSAGES' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">رسائل العملاء</h2>
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white">{msg.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{msg.phone}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">{new Date(msg.date).toLocaleDateString('ar-EG')}</div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-4 rounded-xl text-sm border border-slate-100 dark:border-white/5">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
