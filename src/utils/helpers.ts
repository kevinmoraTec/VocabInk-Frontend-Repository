import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelativeDate = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getCharacterCount = (text: string): number => {
  return text.length;
};

export const getLinkedInCharacterLimit = (): number => {
  return 3000;
};

export const isWithinLinkedInLimit = (text: string): boolean => {
  return getCharacterCount(text) <= getLinkedInCharacterLimit();
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Opens LinkedIn with pre-filled post content
 * Uses the sharing/share-offsite endpoint which has better support for longer content
 * Note: LinkedIn URL params have a ~2000 char limit. For very long posts, 
 * the user should copy and paste manually.
 * @param text - The post content to share
 * @param url - Optional URL to include in the post
 * @returns boolean - true if the full content fits, false if it may be truncated
 */
export const shareToLinkedIn = (text: string, url?: string): boolean => {
  // LinkedIn's share-offsite uses a mini=true parameter and supports longer text
  // The text needs to be encoded properly
  const encodedText = encodeURIComponent(text);
  
  // Check if content might be truncated (URL limit is ~2000 chars)
  const MAX_URL_LENGTH = 2000;
  const baseUrl = 'https://www.linkedin.com/sharing/share-offsite/?';
  const estimatedUrlLength = baseUrl.length + 'text='.length + encodedText.length;
  const mayBeTruncated = estimatedUrlLength > MAX_URL_LENGTH;

  let linkedInUrl: string;

  if (url) {
    // If there's a URL to share, use the share-offsite with url param
    // and append text as a summary
    const params = new URLSearchParams({
      url: url,
      summary: text,
    });
    linkedInUrl = `${baseUrl}${params.toString()}`;
  } else {
    // For text-only posts, use the feed endpoint with shareActive
    // This method works better for longer text content
    const params = new URLSearchParams({
      shareActive: 'true',
      text: text,
    });
    linkedInUrl = `https://www.linkedin.com/feed/?${params.toString()}`;
  }

  window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  return !mayBeTruncated;
};

export const getGreeting = (language: 'en' | 'es' = 'en'): string => {
  const hour = new Date().getHours();
  if (language === 'es') {
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const highlightWords = (text: string, words: string[]): string => {
  let result = text;
  words.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, `**${word}**`);
  });
  return result;
};
