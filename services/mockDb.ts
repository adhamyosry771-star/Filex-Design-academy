

import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  orderBy,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { User, DesignRequest, RequestStatus, Message, Banner, Notification, Announcement, SupportSession, ChatMessage } from '../types';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- Auth Services ---

export const authService = {
  // تسجيل حساب جديد
  register: async (name: string, email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // القائمة البيضاء الحصرية للمدراء
    const adminWhitelist = [
      'filex@flexdesign.academy', // Super Admin
      'farida@flexdesign.academy',
      'admin1@flexdesign.academy',
      'admin2@flexdesign.academy',
      'admin3@flexdesign.academy',
      'supervisor@flexdesign.academy'
    ];

    // التحقق: يجب أن يكون الإيميل موجوداً في القائمة أعلاه فقط
    const isAdmin = adminWhitelist.includes(email.toLowerCase());
    const role = isAdmin ? 'ADMIN' : 'USER';

    const newUser: User = {
      id: fbUser.uid,
      name,
      email,
      role,
      status: 'ACTIVE',
      joinedAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", fbUser.uid), newUser);
    return newUser;
  },

  createAdminAccount: async (name: string, email: string, password: string) => {
    // نستخدم خدعة بسيطة لإنشاء مستخدم ثانوي دون تسجيل خروج المدير الحالي
    let secondaryApp;
    try {
        secondaryApp = getApp('secondary');
    } catch (e) {
        secondaryApp = initializeApp(firebaseConfig, 'secondary');
    }
    
    const secondaryAuth = getAuth(secondaryApp);

    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const fbUser = userCredential.user;

    const newUser: User = {
      id: fbUser.uid,
      name,
      email,
      role: 'ADMIN',
      status: 'ACTIVE',
      joinedAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", fbUser.uid), newUser); // حفظ في قاعدة البيانات الرئيسية
    await signOut(secondaryAuth); // تسجيل خروج من التطبيق الثانوي
  },

  // تسجيل الدخول
  login: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", fbUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      
      // Check if user is banned
      if (userData.status === 'BANNED') {
        await signOut(auth);
        throw new Error("عذراً، تم تعطيل هذا الحساب. يرجى الاتصال بالدعم.");
      }

      // Force role update from whitelist logic if needed (optional security measure)
      const adminWhitelist = [
        'filex@flexdesign.academy',
        'farida@flexdesign.academy',
        'admin1@flexdesign.academy',
        'admin2@flexdesign.academy',
        'admin3@flexdesign.academy',
        'supervisor@flexdesign.academy'
      ];
      if (adminWhitelist.includes(userData.email.toLowerCase()) && userData.role !== 'ADMIN') {
         // Fix role if it was wrong in DB
         await updateDoc(doc(db, "users", fbUser.uid), { role: 'ADMIN' });
         userData.role = 'ADMIN';
      }

      return userData;
    } else {
      // Fallback for old users or direct firebase creation
      return {
        id: fbUser.uid,
        name: email.split('@')[0],
        email: email,
        role: 'USER', // Default fallback
        status: 'ACTIVE',
        joinedAt: new Date().toISOString()
      };
    }
  },

  // تسجيل الخروج
  logout: async () => {
    await signOut(auth);
  },

  // مراقب حالة المستخدم
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", fbUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            if (userData.status === 'BANNED') {
               await signOut(auth);
               callback(null);
               return;
            }
            callback(userData);
          } else {
            // Create minimal user object if doc doesn't exist yet
            callback({
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
              role: 'USER',
              status: 'ACTIVE',
              joinedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Auth state change error", error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
    const updated = await getDoc(userRef);
    return updated.data() as User;
  },

  getAllUsers: async (): Promise<User[]> => {
    const q = query(collection(db, "users"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as User);
  },

  deleteUser: async (userId: string) => {
    await deleteDoc(doc(db, "users", userId));
  },

  toggleUserBan: async (userId: string, currentStatus?: 'ACTIVE' | 'BANNED') => {
    const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
    await updateDoc(doc(db, "users", userId), { status: newStatus });
  }
};

// --- Request Services ---

export const requestService = {
  createRequest: async (request: Omit<DesignRequest, 'id' | 'status' | 'createdAt'>): Promise<DesignRequest> => {
    const newRequest = {
      ...request,
      status: 'PENDING' as RequestStatus,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "requests"), newRequest);
    return { ...newRequest, id: docRef.id };
  },

  getUserRequests: async (userId: string): Promise<DesignRequest[]> => {
    const q = query(collection(db, "requests"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as DesignRequest))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getAllRequests: async (): Promise<DesignRequest[]> => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as DesignRequest));
  },

  updateRequestStatus: async (requestId: string, status: RequestStatus) => {
    await updateDoc(doc(db, "requests", requestId), { status });
  },

  sendMessage: async (name: string, phone: string, text: string) => {
    await addDoc(collection(db, "messages"), {
      name,
      phone,
      text,
      date: new Date().toISOString(),
      read: false
    });
  },

  getMessages: async (): Promise<Message[]> => {
    const q = query(collection(db, "messages"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message));
  },

  // --- Banner Services ---

  uploadBannerImage: async (file: File): Promise<string> => {
    try {
      // Create a safe filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `banners/${Date.now()}_${safeName}`);
      
      // Add metadata
      const metadata = {
        contentType: file.type,
      };

      const snapshot = await uploadBytes(storageRef, file, metadata);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading banner image:", error);
      throw new Error("فشل رفع الصورة. تأكد من إعدادات التخزين في Firebase.");
    }
  },

  addBanner: async (imageUrl: string, title: string) => {
    await addDoc(collection(db, "banners"), {
      imageUrl,
      title,
      isActive: true,
      createdAt: new Date().toISOString()
    });
  },

  getBanners: async (activeOnly: boolean = true): Promise<Banner[]> => {
    let q;
    if (activeOnly) {
      q = query(collection(db, "banners"), where("isActive", "==", true));
    } else {
      q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Banner));
  },

  deleteBanner: async (id: string) => {
    await deleteDoc(doc(db, "banners", id));
  },

  toggleBannerStatus: async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "banners", id), { isActive: !currentStatus });
  }
};

// --- Notification Services ---

export const notificationService = {
  createNotification: async (userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  },

  getUserNotifications: (userId: string, callback: (notifications: Notification[]) => void) => {
    const q = query(
      collection(db, "notifications"), 
      where("userId", "==", userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Notification));
      // Sort client-side: newest first
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(notifs);
    });
  },

  markAsRead: async (notificationId: string) => {
    await updateDoc(doc(db, "notifications", notificationId), { isRead: true });
  },

  markAllAsRead: async (userId: string) => {
    const q = query(
      collection(db, "notifications"), 
      where("userId", "==", userId),
      where("isRead", "==", false)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });
    await batch.commit();
  }
};

// --- Announcement Service (Official Messages) ---

export const announcementService = {
  createAnnouncement: async (title: string, message: string, createdBy: string) => {
    await addDoc(collection(db, "announcements"), {
      title,
      message,
      createdAt: new Date().toISOString(),
      createdBy
    });
  },

  getAnnouncements: (callback: (announcements: Announcement[]) => void) => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Announcement));
      callback(data);
    });
  },

  markAsRead: async (userId: string, announcementId: string) => {
    // Add to a collection tracking read statuses
    // Using a composite ID of userId_announcementId to prevent duplicates
    const readRef = doc(db, "announcement_reads", `${userId}_${announcementId}`);
    await setDoc(readRef, {
      userId,
      announcementId,
      readAt: new Date().toISOString()
    });
  },

  getReadIds: (userId: string, callback: (readIds: Set<string>) => void) => {
    const q = query(collection(db, "announcement_reads"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
      const ids = new Set(); // Standard JS Set
      snapshot.docs.forEach(doc => {
        ids.add(doc.data().announcementId);
      });
      callback(ids as Set<string>);
    });
  }
};

// --- Live Support Service ---

export const supportService = {
  getUserActiveSession: (userId: string, callback: (sessionId: string | null) => void) => {
    // Check for either WAITING or ACTIVE status
    const q = query(
      collection(db, "support_sessions"), 
      where("userId", "==", userId),
      where("status", "in", ["WAITING", "ACTIVE"]) 
    );
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        callback(snapshot.docs[0].id);
      } else {
        callback(null);
      }
    });
  },

  createSession: async (userId: string, userName: string) => {
    // Create Session - Initial state is WAITING with no admin assigned
    const newSession: Omit<SupportSession, 'id'> = {
      userId,
      userName,
      adminId: null, // No admin yet
      status: 'WAITING',
      lastMessageAt: new Date().toISOString(),
      unreadByUser: 0,
      unreadByAdmin: 1
    };
    
    const docRef = await addDoc(collection(db, "support_sessions"), newSession);
    return docRef.id;
  },

  // New function to claim a chat
  acceptSession: async (sessionId: string, adminId: string) => {
    await updateDoc(doc(db, "support_sessions", sessionId), { 
      status: 'ACTIVE',
      adminId: adminId
    });
  },

  endSession: async (sessionId: string) => {
    await updateDoc(doc(db, "support_sessions", sessionId), { status: 'CLOSED' });
  },

  sendMessage: async (sessionId: string, senderId: string, senderName: string, text: string, isAdmin: boolean) => {
    await addDoc(collection(db, `support_sessions/${sessionId}/messages`), {
      senderId,
      senderName,
      text,
      timestamp: new Date().toISOString(),
      isAdmin
    });

    await updateDoc(doc(db, "support_sessions", sessionId), {
      lastMessageAt: new Date().toISOString()
    });
  },

  getMessages: (sessionId: string, callback: (messages: ChatMessage[]) => void) => {
    const q = query(collection(db, `support_sessions/${sessionId}/messages`), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ChatMessage));
      callback(msgs);
    });
  },

  getAdminSessions: (adminUser: User, callback: (sessions: SupportSession[]) => void) => {
    // We want to fetch WAITING sessions (for everyone) AND ACTIVE sessions (only for this admin)
    // To avoid index errors, we'll fetch all non-closed sessions and filter in JS
    // This is safer given the "Index" issues we've had.
    
    const q = query(collection(db, "support_sessions")); // Fetch all, filter below
    
    return onSnapshot(q, (snapshot) => {
      const allSessions = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SupportSession));
      
      const filteredSessions = allSessions.filter(session => {
        // 1. Waiting sessions (Visible to all admins)
        if (session.status === 'WAITING') return true;
        
        // 2. Active sessions (Visible ONLY to the assigned admin OR Super Admin for oversight)
        if (session.status === 'ACTIVE') {
          return session.adminId === adminUser.id || adminUser.email === 'filex@flexdesign.academy';
        }

        return false;
      });

      // Sort by lastMessageAt descending (newest first)
      filteredSessions.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      callback(filteredSessions);
    });
  }
};

// --- System Service (Reset & Maintenance) ---

export const systemService = {
  resetAllSystemData: async () => {
    const batch = writeBatch(db);
    const collectionsToClear = [
      'requests',
      'messages',
      'notifications',
      'announcements',
      'announcement_reads',
      'banners',
      'support_sessions'
    ];

    for (const colName of collectionsToClear) {
      const q = query(collection(db, colName));
      const snapshot = await getDocs(q);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    await batch.commit();
  }
};