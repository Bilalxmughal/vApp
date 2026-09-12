import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useQuestionStore } from '../store/questionStore'
import { VoteChoice, VoteResult } from '../types'
import * as SecureStore from 'expo-secure-store'

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function getGuestId(): Promise<string> {
  let id = await SecureStore.getItemAsync('guest_id')
  if (!id) {
    id = generateId()
    await SecureStore.setItemAsync('guest_id', id)
  }
  return id
}

interface UseVoteReturn {
  vote: (questionId: string, choice: VoteChoice) => Promise<void>
  isVoting: boolean
  error: string | null
}

export function useVote(): UseVoteReturn {
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuthStore()
  const { recordVote, setResult, hasVoted } = useQuestionStore()

  const vote = useCallback(
    async (questionId: string, choice: VoteChoice) => {
      if (hasVoted(questionId)) return
      setIsVoting(true)
      setError(null)

      // Optimistic: record locally first
      recordVote(questionId, choice)

      try {
        const votePayload: Record<string, unknown> = {
          question_id: questionId,
          choice,
        }

        if (user) {
          votePayload.user_id = user.id
        } else {
          votePayload.guest_id = await getGuestId()
        }

        const { error: voteError } = await supabase.from('votes').insert(votePayload)

        if (voteError) {
          // 23505 = unique violation (already voted)
          if (voteError.code !== '23505') {
            throw voteError
          }
        }

        // Fetch updated counts
        const { data: q } = await supabase
          .from('questions')
          .select('vote_count_a, vote_count_b, total_votes')
          .eq('id', questionId)
          .single()

        if (q) {
          const total = q.total_votes || 1
          const result: VoteResult = {
            question_id: questionId,
            choice,
            percent_a: Math.round((q.vote_count_a / total) * 100),
            percent_b: Math.round((q.vote_count_b / total) * 100),
            total_votes: q.total_votes,
          }
          setResult(questionId, result)
        }
      } catch (e: unknown) {
        setError((e as Error).message ?? 'Vote failed')
      } finally {
        setIsVoting(false)
      }
    },
    [user, hasVoted, recordVote, setResult],
  )

  return { vote, isVoting, error }
}
