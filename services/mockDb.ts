
import { initializeApp } from 'firebase/app';
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
  orderBy
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { User, DesignRequest, RequestStatus, Message, Banner } from '../types';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- Auth Services ---

export const authService = {
  // تسجيل حساب جديد
  register: async (name: string, email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // القائمة البيضاء الحصرية للمدراء - لن يتم قبول أي إيميل آخر كمدير
    const adminWhitelist = [
      'farida@flexdesign.com',
      'admin1@flexdesign.com',
      'admin2@flexdesign.com',
      'supervisor@flexdesign.com'
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
