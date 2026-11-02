import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Template is now a string to support dynamic templates from backend
export type PostTemplate = string;

export interface GeneratedPost {
  id: string;
  content: string;
  template: PostTemplate;
  wordsUsed: string[];
  createdAt: string;
}

interface PostState {
  posts: GeneratedPost[];
  addPost: (post: Omit<GeneratedPost, 'id' | 'createdAt'>) => void;
  removePost: (id: string) => void;
  getRecentPosts: (limit?: number) => GeneratedPost[];
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],
      addPost: (postData) =>
        set((state) => ({
          posts: [
            {
              ...postData,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.posts,
          ],
        })),
      removePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      getRecentPosts: (limit = 5) => get().posts.slice(0, limit),
    }),
    {
      name: 'vocabink-posts',
    }
  )
);
