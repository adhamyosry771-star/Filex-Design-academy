
import React, { useEffect, useState } from 'react';
import { User, DesignRequest, RequestStatus } from '../types';
import { authService, requestService } from '../services/mockDb';
import { Button } from './Button';
import { User as UserIcon, Package, Clock, CheckCircle2, XCircle, Save, Loader2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'PROFILE'>('REQUESTS');
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  
  // Profile State
  const [profileData, setProfileData] = useState({ name: user.name, email: user.email });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (activeTab === 'REQUESTS') {
        setIsLoadingRequests(true);
        try {
          const userRequests = await requestService.getUserRequests(user.id);
          setRequests(userRequests);
        } catch (e) {
          console.error("Error fetching requests", e);
        } finally {
          setIsLoadingRequests(false);
        }
      }
    };
    fetchRequests();
  }, [activeTab, user.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      const updated = await authService.updateProfile(user.id, profileData);
      onUserUpdate(updated);
      setMessage({ type: 'success', text: 'تم تحديث المعلومات بنجاح' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل تحديث المعلومات' });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> قيد المراجعة</span>;
      case 'IN_PROGRESS':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> جاري العمل</span>;
      case 'COMPLETED':
        return <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> مكتمل</span>;
      case 'REJECTED':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12} /> مرفوض</span>;
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-white placeholder-slate-500";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in relative z-10">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 bg-black/20 border-l border-white/5 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white truncate max-w-[140px]">{user.name}</div>
              <div className="text-xs text-slate-400">
                {user.joinedAt ? `عضو منذ ${new Date(user.joinedAt).toLocaleDateString('ar-EG')}` : 'عضو مميز'}
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'REQUESTS' ? 'bg-white/10 text-white font-semibold shadow-lg border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Package size={20} />
              طلباتي
            </button>
            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PROFILE' ? 'bg-white/10 text-white font-semibold shadow-lg border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <UserIcon size={20} />
              الملف الشخصي
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'REQUESTS' ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">سجل الطلبات</h2>
              {isLoadingRequests ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                  <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300">لا توجد طلبات حتى الآن</h3>
                  <p className="text-slate-500 mb-6">ابدأ مشروعك الأول معنا اليوم</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">#{req.id.substring(0, 8)}</div>
                          <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{req.projectType}</h3>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{req.description}</p>
                      <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-white/5">
                        <span>تاريخ الطلب: {new Date(req.createdAt).toLocaleDateString('ar-EG')}</span>
                        {req.budget && <span>الميزانية: {req.budget}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">تعديل الملف الشخصي</h2>
              <form onSubmit={handleUpdateProfile} className="max-w-lg space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    className={inputClasses}
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    className={inputClasses}
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {message.text}
                  </div>
                )}

                <Button type="submit" isLoading={isSaving} icon={<Save size={18} />}>
                  حفظ التغييرات
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
