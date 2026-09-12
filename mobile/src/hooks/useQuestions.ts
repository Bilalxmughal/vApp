import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useQuestionStore } from '../store/questionStore'
import { Question } from '../types'

export function useDailyQuestion() {
  const { dailyQuestion, setDailyQuestion } = useQuestionStore()
  const [isLoading, setIsLoading] = useState(!dailyQuestion)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (dailyQuestion) return
    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('questions')
      .select('*, category:categories(id, name, slug, emoji, order_index, is_active)')
      .eq('is_daily', true)
      .eq('daily_date', today)
      .maybeSingle()
      .then(({ data, error: e }) => {
        if (e) setError(e.message)
        if (data) setDailyQuestion(data as Question)
        setIsLoading(false)
      })
  }, [])

  return { dailyQuestion, isLoading, error }
}

export function useQuestionsByCategory(categorySlug: string, limit = 20) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categorySlug) return
    supabase
      .from('questions')
      .select('*, category:categories!inner(slug)')
      .eq('status', 'active')
      .eq('moderation_status', 'approved')
      .eq('categories.slug', categorySlug)
      .order('engagement_score', { ascending: false })
      .limit(limit)
      .then(({ data, error: e }) => {
        if (e) setError(e.message)
        if (data) setQuestions(data as Question[])
        setIsLoading(false)
      })
  }, [categorySlug, limit])

  return { questions, isLoading, error }
}

export function useRandomQuestions(limit = 10) {
  const { setFeedQuestions } = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('questions')
      .select('*, category:categories(id, name, slug, emoji, order_index, is_active)')
      .eq('status', 'active')
      .eq('moderation_status', 'approved')
      .eq('is_daily', false)
      .order('engagement_score', { ascending: false })
      .limit(limit * 3)
      .then(({ data }) => {
        if (data) {
          const shuffled = [...(data as Question[])].sort(() => Math.random() - 0.5)
          setFeedQuestions(shuffled.slice(0, limit))
        }
        setIsLoading(false)
      })
  }, [])

  return { isLoading }
}
