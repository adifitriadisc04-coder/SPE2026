export interface SchoolInfo {
  name: string;
  npsn: string;
  accreditation: string;
  status: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  address: string;
  mapsQuery: string;
  footerAbout: string;
  logo: string;
  qrCode: string;
  qrCaption: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  image: string;
  stats: HeroStat[];
}

export interface PrincipalInfo {
  name: string;
  nip: string;
  period: string;
  photo: string;
  focus: string[];
}

export interface WelcomeSection {
  title: string;
  paragraphs: string[];
}

export interface SchoolMemoryPhoto {
  id: string;
  image: string;
  title: string;
  year: string;
  caption: string;
}

export interface ProfileSection {
  title: string;
  intro: string;
  history: string;
  videoUrl: string;
  vision: string;
  missions: string[];
  schoolMemories: SchoolMemoryPhoto[]; // Poin 1: Foto memori sekolah lama / masa lalu
}

export interface FacilityItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface TeacherItem {
  id: string;
  name: string;
  role: string;
  nip: string;
  photo: string;
}

export interface PrincipalHistoryItem {
  id: string;
  period: string;
  name: string;
}

export interface HallOfFameItem {
  id: string;
  year: string;
  name: string;
  title: string;
  description: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  photos: string[];
}

export interface AchievementItem {
  id: string;
  year: string;
  level: string;
  title: string;
  description: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'akademik' | 'kegiatan' | 'nasional';
}

export interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
}

export interface SocialConfig {
  enabled: boolean;
  url: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  origin: string;
  message: string;
  date: string;
  approved: boolean;
}

export interface TypographySettings {
  headingFont: string; // e.g. "Fraunces", "Playfair Display", "Poppins", "Montserrat", "Lora", "Plus Jakarta Sans"
  bodyFont: string;    // e.g. "Plus Jakarta Sans", "Inter", "Roboto", "Open Sans", "Nunito", "Quicksand"
  fontSizeScale: 'small' | 'normal' | 'large' | 'xlarge'; // besar kecil huruf
  headingColor: string; // hex color
  bodyColor: string;    // hex color
  paragraphAlignment: 'left' | 'justify' | 'center' | 'right'; // alignment otomatis rapi
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface ThemeConfig {
  defaultTheme: 'light' | 'dark';
  allowToggle: boolean;
}

export interface AuthData {
  user: string;
  salt: string;
  hash: string;
  rsalt: string;
  rhash: string;
}

export interface SchoolWebsiteData {
  stamp: number;
  school: SchoolInfo;
  hero: HeroSection;
  principal: PrincipalInfo;
  welcome: WelcomeSection;
  profile: ProfileSection;
  facilities: FacilityItem[];
  teachers: TeacherItem[];
  principalsHistory: PrincipalHistoryItem[];
  hallOfFame: HallOfFameItem[];
  gallery: GalleryAlbum[];
  achievements: AchievementItem[];
  events: CalendarEvent[];
  news: NewsItem[];
  social: {
    facebook: SocialConfig;
    instagram: SocialConfig;
    tiktok: SocialConfig;
    youtube: SocialConfig;
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    label: string;
    message: string;
  };
  typography: TypographySettings;
  theme: ThemeConfig;
  guestbook: GuestbookEntry[];
  auth: AuthData;
}
