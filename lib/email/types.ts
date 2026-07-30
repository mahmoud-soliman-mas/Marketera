export type EmailType = 'subject-lines' | 'welcome' | 'sales' | 'follow-up' | 'promotional' | 'newsletter';

export interface EmailRequest {
  product: string;
  audience: string;
  emailType: EmailType;
  goal: string;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface EmailResult {
  subjectLines?: string[];
  emailBody?: string;
  preview?: string;
}

export const EMAIL_TYPE_LABELS: Record<EmailType, string> = {
  'subject-lines': 'Subject Lines',
  'welcome': 'Welcome Email',
  'sales': 'Sales Email',
  'follow-up': 'Follow-up Email',
  'promotional': 'Promotional Email',
  'newsletter': 'Newsletter',
};
