import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WordCategory = 'technical' | 'business' | 'soft-skills';

export interface Word {
  id: string;
  word: string;
  category: WordCategory;
  context?: string;
  examplePhrase?: string;
  createdAt: string;
}

interface WordState {
  words: Word[];
  addWord: (word: Omit<Word, 'id' | 'createdAt'>) => void;
  removeWord: (id: string) => void;
  getWordsByCategory: (category: WordCategory) => Word[];
}

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      words: [],
      addWord: (wordData) =>
        set((state) => ({
          words: [
            ...state.words,
            {
              ...wordData,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      removeWord: (id) =>
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
        })),
      getWordsByCategory: (category) =>
        get().words.filter((w) => w.category === category),
    }),
    {
      name: 'vocabink-words',
    }
  )
);
