export type AppScreen =
  | 'splash'
  | 'login'
  | 'signup'
  | 'home'
  | 'plan'
  | 'course_result'
  | 'course_detail'
  | 'discover'
  | 'event_detail'
  | 'community'
  | 'community_course_detail'
  | 'mypage';

export type NavTab = 'home' | 'plan' | 'discover' | 'community' | 'mypage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'local_creator' | 'traveler';
  badgeText?: string;
  isVerifiedLocal: boolean;
  bio: string;
  savedCount: number;
  forkedCount: number;
  createdCount: number;
}

export interface Place {
  id: string;
  name: string;
  category: '포토스팟' | '카페탐방' | '미식' | '산책로' | '문화예술' | '액티비티';
  area: '광안리/수영' | '해운대/송정' | '영도/남포' | '전포/서면';
  address: string;
  image: string;
  description: string;
  tags: string[];
  stayDurationMinutes: number;
  highlightPill?: string;
  isMustVisit?: boolean;
}

export interface TransitInfo {
  type: 'walk' | 'bus' | 'taxi' | 'subway';
  durationMinutes: number;
  description: string;
  cost?: string;
}

export interface CourseItem {
  id: string;
  placeId: string;
  place: Place;
  order: number;
  startTime: string;
  endTime: string;
  stayDurationMinutes: number;
  highlightTag?: string;
  transitToNext?: TransitInfo;
  isMustVisit?: boolean;
  isLocked?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: '축제·야간' | '팝업·플리마켓' | '전시·공연' | '로컬체험';
  area: '광안리/수영' | '해운대/송정' | '영도/남포' | '전포/서면';
  address: string;
  dateStr: string;
  timeRange: string;
  image: string;
  isFree: boolean;
  ticketInfo?: string;
  badges: string[];
  smartInsertionNote: string;
  proximityMinutes: number;
  isConflictRisk?: boolean;
  conflictReason?: string;
  replacementProposal?: {
    title: string;
    description: string;
  };
}

export interface TripCourse {
  id: string;
  postId?: string;
  title: string;
  subtitle?: string;
  area: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerifiedLocal: boolean;
    badgeText?: string;
  };
  tags: string[];
  totalDuration: string;
  estimatedSteps: number;
  forkCount: number;
  bookmarkCount: number;
  reviewCount: number;
  rating?: number;
  coverImage: string;
  items: CourseItem[];
  isPublic: boolean;
  createdAt: string;
  optimizationMode?: 'ai_experience' | 'min_distance';
}

export interface CourseComment {
  id: string;
  courseId: string;
  userId?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface DateOption {
  dayOfWeek: string;
  dateStr: string;
  hasEventChange: boolean;
  note: string;
}
