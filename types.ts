

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

export type PageView = 'HOME' | 'REQUEST_FORM' | 'SUCCESS' | 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'ADMIN_DASHBOARD' | 'CONTACT';