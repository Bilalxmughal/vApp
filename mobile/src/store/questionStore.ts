import { create } from 'zustand'
import { Question, VoteChoice, VoteResult } from '../types'

interface QuestionState {
  dailyQuestion: Question | null
  feedQuestions: Question[]
  votedQuestions: Record<string, VoteChoice>  // questionId → choice
  results: Record<string, VoteResult>          // questionId → result
  currentFeedIndex: number

  setDailyQuestion: (q: Question) => void
  setFeedQuestions: (questions: Question[]) => void
  recordVote: (questionId: string, choice: VoteChoice) => void
  setResult: (questionId: string, result: VoteResult) => void
  advanceFeed: () => void
  hasVoted: (questionId: string) => boolean
  getResult: (questionId: string) => VoteResult | null
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  dailyQuestion: null,
  feedQuestions: [],
  votedQuestions: {},
  results: {},
  currentFeedIndex: 0,

  setDailyQuestion: (q) => set({ dailyQuestion: q }),

  setFeedQuestions: (questions) => set({ feedQuestions: questions, currentFeedIndex: 0 }),

  recordVote: (questionId, choice) =>
    set((s) => ({ votedQuestions: { ...s.votedQuestions, [questionId]: choice } })),

  setResult: (questionId, result) =>
    set((s) => ({ results: { ...s.results, [questionId]: result } })),

  advanceFeed: () =>
    set((s) => ({ currentFeedIndex: s.currentFeedIndex + 1 })),

  hasVoted: (questionId) => questionId in get().votedQuestions,

  getResult: (questionId) => get().results[questionId] ?? null,
}))
