import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnswerValue = number | string | string[] | null;

interface AssessmentState {
  answers: Record<string, AnswerValue>;
  notes: string;
  setAnswer: (id: string, value: AnswerValue) => void;
  setNotes: (value: string) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      answers: {},
      notes: '',
      setAnswer: (id, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [id]: value,
          },
        })),
      setNotes: (value) => set({ notes: value }),
      reset: () => set({ answers: {}, notes: '' }),
    }),
    {
      name: 'healer-assessment',
    },
  ),
);
