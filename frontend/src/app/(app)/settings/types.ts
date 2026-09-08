export type SettingsSectionId =
  | 'profile'
  | 'security'
  | 'privacy'
  | 'help_about';

export interface UserProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  avatarUrl: string;
  companyName?: string;
  role: string;
  timezone: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface KeyboardShortcutItem {
  keyCombo: string[];
  description: string;
  category: string;
}
