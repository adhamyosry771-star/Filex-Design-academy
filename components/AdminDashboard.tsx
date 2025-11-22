
import React, { useEffect, useState, useRef } from 'react';
import { User, DesignRequest, RequestStatus, Message, Banner } from '../types';
import { requestService, authService } from '../services/mockDb';
import { ShieldCheck, Package, MessageSquare, Users, Layout, Clock, CheckCircle2, Loader2, XCircle, Trash2, Eye, EyeOff, Plus, Activity, Upload, Lock, Unlock } from 'lucide-react';
import { Button } from './Button';

interface AdminDashboardProps {
  user: User;
}

type TabType = 'REQUESTS' | 'MESSAGES' | 'USERS' | 'BANNERS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('REQUESTS');
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Banner State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    await requestService.updateRequestStatus(requestId, newStatus);
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
      alert("فشل رفع الصورة. يرجى التحقق من اتصال الإنترنت أو صلاحيات التخزين.");
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

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'IN_PROGRESS': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'COMPLETED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'REJECTED': return 'text-red-400 bg-red-400/10 border-red-400/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in relative z-10">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
             <div className="text-slate-400 text-sm font-semibold">المستخدمين</div>
             <div className="text-2xl font-bold text-white mt-1">{users.length}</div>
          </div>
          <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400"><Users size={24} /></div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
             <div className="text-slate-400 text-sm font-semibold">الطلبات</div>
             <div className="text-2xl font-bold text-white mt-1">{requests.length}</div>
          </div>
          <div className="bg-amber-500/20 p-3 rounded-xl text-amber-400"><Package size={24} /></div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
             <div className="text-slate-400 text-sm font-semibold">الرسائل</div>
             <div className="text-2xl font-bold text-white mt-1">{messages.length}</div>
          </div>
          <div className="bg-pink-500/20 p-3 rounded-xl text-pink-400"><MessageSquare size={24} /></div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
             <div className="text-slate-400 text-sm font-semibold">البنرات النشطة</div>
             <div className="text-2xl font-bold text-white mt-1">{banners.filter(b => b.isActive).length}</div>
          </div>
          <div className="bg-cyan-500/20 p-3 rounded-xl text-cyan-400"><Layout size={24} /></div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden min-h-[800px] flex flex-col lg:flex-row">
        
        {/* Admin Sidebar */}
        <div className="lg:w-72 bg-[#050914]/50 border-l border-white/5 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-lg">لوحة المدير</div>
              <div className="text-xs text-amber-500 font-medium tracking-wider">ADMIN PANEL</div>
            </div>
          </div>

          <nav className="space-y-2 flex-1 overflow-x-auto lg:overflow-visible flex lg:block gap-2 pb-4 lg:pb-0">
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'REQUESTS' ? 'bg-white/10 text-white font-semibold shadow-lg border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Package size={20} />
                <span>كل الطلبات</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'USERS' ? 'bg-white/10 text-white font-semibold shadow-lg border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                <span>المستخدمين</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('BANNERS')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'BANNERS' ? 'bg-white/10 text-white font-semibold shadow-lg border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Layout size={20} />
                <span>إدارة البنرات</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('MESSAGES')}
              className={`w-full flex items-center whitespace-nowrap lg:whitespace-normal justify-between px-4 py-4 rounded-xl transition-all ${activeTab === 'MESSAGES' ? 'bg-white/10 text-white font-semibold shadow-lg border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} />
                <span>الرسائل</span>
              </div>
              <span className="bg-white/10 text-xs py-1 px-2 rounded-md">{messages.length}</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 hidden lg:block">
             <div className="flex items-center gap-2 text-slate-500 justify-center text-sm">
                <Activity size={14} className="animate-pulse text-green-500" />
                <span>النظام يعمل بكفاءة</span>
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#0f172a]/30 overflow-y-auto max-h-[900px]">
          
          {/* --- REQUESTS TAB --- */}
          {activeTab === 'REQUESTS' && (
            <div className="p-4 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white">إدارة الطلبات الواردة</h2>
                <button onClick={fetchData} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <Loader2 size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/10">
                <table className="w-full text-right border-collapse min-w-[900px]">
                  <thead>
                    <tr className="text-slate-400 text-sm border-b border-white/10 bg-white/5">
                      <th className="py-4 px-6 font-medium whitespace-nowrap">العميل</th>
                      <th className="py-4 px-4 font-medium whitespace-nowrap">نوع المشروع</th>
                      <th className="py-4 px-4 font-medium min-w-[250px]">الوصف</th>
                      <th className="py-4 px-4 font-medium whitespace-nowrap">الحالة</th>
                      <th className="py-4 px-6 font-medium whitespace-nowrap">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-200">
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-6 align-top">
                          <div className="font-bold text-white text-base">{req.clientName}</div>
                          <div className="text-xs text-slate-400 font-mono mt-1">{req.email}</div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-sm font-medium inline-block whitespace-nowrap">
                            {req.projectType}
                          </span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                            <p className="text-sm text-slate-300 leading-relaxed line-clamp-3" title={req.description}>{req.description}</p>
                            {req.budget && <div className="text-xs text-green-400 mt-2 font-mono">💰 الميزانية: {req.budget}</div>}
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
                            <button onClick={() => handleStatusChange(req.id, 'IN_PROGRESS')} className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all" title="جاري العمل"><Loader2 size={18} /></button>
                            <button onClick={() => handleStatusChange(req.id, 'COMPLETED')} className="p-2 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all" title="اكتمال"><CheckCircle2 size={18} /></button>
                            <button onClick={() => handleStatusChange(req.id, 'REJECTED')} className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="رفض"><XCircle size={18} /></button>
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

          {/* --- USERS TAB --- */}
          {activeTab === 'USERS' && (
            <div className="p-4 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-8">المستخدمين المسجلين ({users.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {users.map((u) => (
                  <div key={u.id} className={`bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/10 transition-colors group ${u.status === 'BANNED' ? 'opacity-70 bg-red-900/10 border-red-900/30' : ''}`}>
                     {/* User Info Section */}
                     <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 relative shadow-lg">
                           {u.name.charAt(0).toUpperCase()}
                           {u.status === 'BANNED' && <div className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900"><XCircle size={12} /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                           <div className="font-bold text-white flex items-center gap-2">
                             <span className="truncate" title={u.name}>{u.name}</span>
                             {u.status === 'BANNED' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full shrink-0">محظور</span>}
                             {u.role === 'ADMIN' && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">مدير</span>}
                           </div>
                           <div className="text-sm text-slate-400 truncate font-mono" title={u.email}>{u.email}</div>
                        </div>
                     </div>

                     {/* Actions & Meta Section */}
                     <div className="flex items-center justify-between w-full md:w-auto gap-4 md:pl-4 mt-2 md:mt-0 border-t border-white/5 md:border-none pt-4 md:pt-0">
                        <div className="text-xs text-slate-500 flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap">
                           <Clock size={12} />
                           {new Date(u.joinedAt).toLocaleDateString('ar-EG')}
                        </div>
                        
                        {u.role !== 'ADMIN' && (
                           <div className="flex gap-2 shrink-0">
                             <button 
                                onClick={() => handleToggleBanUser(u.id, u.status)}
                                className={`p-2 rounded-lg transition-colors border ${u.status === 'BANNED' ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white'}`}
                                title={u.status === 'BANNED' ? "فك الحظر" : "حظر المستخدم"}
                             >
                                {u.status === 'BANNED' ? <Unlock size={18} /> : <Lock size={18} />}
                             </button>
                             <button 
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 hover:bg-red-500 hover:text-white bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg transition-colors" 
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
              <h2 className="text-2xl font-bold text-white mb-6">إدارة بنرات الإعلانات</h2>
              
              <form onSubmit={handleAddBanner} className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
                 <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus size={18} /> إضافة بنر جديد
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input 
                       type="text" 
                       placeholder="عنوان البنر"
                       className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
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
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-colors ${selectedFile ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-black/20 border-white/20 text-slate-400 hover:border-primary hover:text-primary'}`}
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
                    <div key={banner.id} className={`relative rounded-xl overflow-hidden border ${banner.isActive ? 'border-primary/50' : 'border-white/10 opacity-70'}`}>
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
              <h2 className="text-2xl font-bold text-white mb-8">رسائل العملاء</h2>
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-white">{msg.name}</div>
                          <div className="text-xs text-slate-400">{msg.phone}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">{new Date(msg.date).toLocaleDateString('ar-EG')}</div>
                    </div>
                    <p className="text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl text-sm">
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
