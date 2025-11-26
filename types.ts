

export enum ProjectType {
  VOICE_AGENCIES = 'تصاميم وكالات وإدارات صوتية',
  LOGO = 'تصميم شعار',
  BRANDING = 'هوية بصرية',
  WEB_DESIGN = 'تصميم مواقع UI/UX',
  SOCIAL_MEDIA = 'تصاميم سوشيال ميديا',
  VIDEO_EDITING = 'مونتاج فيديو',
  OTHER = 'أخرى'
}

export type RequestStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface DesignRequest {
  id: string;
  userId?: string;
  clientName: string;
  email: string;
  projectType: ProjectType;
  description: string;
  budget?: string;
  status: RequestStatus;
  createdAt: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: UserRole;
  status?: 'ACTIVE' | 'BANNED';
  joinedAt: string;
}

export interface Message {
  id: string;
  name: string;
  phone: string;
  text: string;
  date: string;
  read: boolean;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

// --- Live Support Types ---

export interface ChatMessage {
  id: string;
  senderId: string; // 'user', 'bot', or Admin ID
  senderName: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportSession {
  id: string;
  userId: string;
  userName: string;
  adminId: string | null; // Null when WAITING
  status: 'WAITING' | 'ACTIVE' | 'CLOSED'; // Updated Statuses
  lastMessageAt: string;
  unreadByUser: number;
  unreadByAdmin: number;
}

export type PageView = 'HOME' | 'REQUEST_FORM' | 'SUCCESS' | 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'ADMIN_DASHBOARD' | 'CONTACT' | 'USER_MESSAGES' | 'LIVE_SUPPORT';

export type Language = 'ar' | 'en' | 'fr';