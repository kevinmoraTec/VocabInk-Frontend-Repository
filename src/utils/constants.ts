export const API_URL = import.meta.env.VITE_API_URL || '/api';

// LinkedIn OAuth
export const LINKEDIN_CONNECT_ENDPOINT = '/v1/auth/linkedin/connect';
export const LINKEDIN_STATUS_ENDPOINT = '/v1/auth/linkedin/status';
export const LINKEDIN_DISCONNECT_ENDPOINT = '/v1/auth/linkedin/disconnect';

// Supported languages for both app and content
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', nativeLabel: 'Español' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷', nativeLabel: 'Português' },
] as const;

export const ENGLISH_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting to learn English' },
  { value: 'intermediate', label: 'Intermediate', description: 'Can communicate but need practice' },
  { value: 'advanced', label: 'Advanced', description: 'Fluent but want to refine vocabulary' },
] as const;

export const PROFESSIONAL_ROLES = [
  // Technology
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Site Reliability Engineer (SRE)',
  'Data Scientist',
  'Data Engineer',
  'Data Analyst',
  'Machine Learning Engineer',
  'AI Engineer',
  'Cloud Architect',
  'Security Engineer',
  'Cybersecurity Analyst',
  'QA Engineer',
  'Test Automation Engineer',
  'Product Manager',
  'Product Owner',
  'UX Designer',
  'UI Designer',
  'Product Designer',
  'Tech Lead',
  'Engineering Manager',
  'CTO',
  'VP of Engineering',
  'Solutions Architect',
  'Technical Writer',
  'Developer Advocate',
  'Database Administrator',
  // Healthcare
  'Doctor / Physician',
  'Nurse',
  'Medical Specialist',
  'Healthcare Administrator',
  'Pharmacist',
  'Psychologist / Therapist',
  // Business & Finance
  'Marketing Manager',
  'Digital Marketing Specialist',
  'Sales Professional',
  'Financial Analyst',
  'Accountant',
  'Business Consultant',
  'HR Professional',
  'Project Manager',
  'Operations Manager',
  // Creative
  'Content Creator',
  'Graphic Designer',
  'Video Producer',
  'Copywriter',
  'Social Media Manager',
  // Education
  'Teacher / Professor',
  'Researcher',
  'Academic',
  'Educational Consultant',
  // Legal
  'Lawyer / Attorney',
  'Legal Consultant',
  // Entrepreneurship
  'Founder / CEO',
  'Startup Founder',
  'Freelancer / Consultant',
  'Business Owner',
  // Other
  'Other',
] as const;

export const WRITING_TOPICS = [
  // Tech
  { value: 'backend', label: 'Backend Development', category: 'tech' },
  { value: 'frontend', label: 'Frontend Development', category: 'tech' },
  { value: 'cloud', label: 'Cloud & Infrastructure', category: 'tech' },
  { value: 'ai-ml', label: 'AI & Machine Learning', category: 'tech' },
  { value: 'devops', label: 'DevOps & CI/CD', category: 'tech' },
  { value: 'data', label: 'Data & Analytics', category: 'tech' },
  { value: 'cybersecurity', label: 'Cybersecurity', category: 'tech' },
  // Professional Growth
  { value: 'career', label: 'Career Growth', category: 'growth' },
  { value: 'leadership', label: 'Leadership', category: 'growth' },
  { value: 'productivity', label: 'Productivity & Tools', category: 'growth' },
  { value: 'personal-branding', label: 'Personal Branding', category: 'growth' },
  { value: 'networking', label: 'Networking & Community', category: 'growth' },
  // Industry Specific
  { value: 'healthcare', label: 'Healthcare & Medicine', category: 'industry' },
  { value: 'finance', label: 'Finance & Business', category: 'industry' },
  { value: 'marketing', label: 'Marketing & Sales', category: 'industry' },
  { value: 'education', label: 'Education & Learning', category: 'industry' },
  { value: 'entrepreneurship', label: 'Entrepreneurship', category: 'industry' },
  { value: 'legal', label: 'Legal & Compliance', category: 'industry' },
] as const;

export const DISCOVERY_SOURCES = [
  'LinkedIn',
  'Twitter/X',
  'Friend Referral',
  'Google Search',
  'YouTube',
  'Other',
] as const;

export const POST_FREQUENCIES = [
  { value: 'daily', label: 'Daily', description: 'Post every day' },
  { value: '3x-week', label: '3x per week', description: 'Post 3 times a week' },
  { value: 'weekly', label: 'Weekly', description: 'Post once a week' },
] as const;

export const WORD_CATEGORIES = [
  { value: 'technical', label: 'Technical', color: 'primary' },
  { value: 'business', label: 'Business', color: 'accent' },
  { value: 'soft-skills', label: 'Soft Skills', color: 'success' },
] as const;
