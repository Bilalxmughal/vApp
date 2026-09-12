import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native'
import { colors, radius, fontSize, fontWeight, spacing } from '../../theme'
import { Question, VoteChoice, VoteResult } from '../../types'
import { OptionButton } from './OptionButton'
import { ResultBar } from './ResultBar'
import { PersonalityTag } from './PersonalityTag'
import { useVote } from '../../hooks/useVote'
import { useQuestionStore } from '../../store/questionStore'

interface QuestionCardProps {
  question: Question
  onNext?: () => void
  isDaily?: boolean
}

export function QuestionCard({ question, onNext, isDaily }: QuestionCardProps) {
  const { vote, isVoting } = useVote()
  const { hasVoted, getResult, votedQuestions } = useQuestionStore()

  const voted = hasVoted(question.id)
  const myChoice = votedQuestions[question.id] as VoteChoice | undefined
  const result = getResult(question.id)

  const handleVote = (choice: VoteChoice) => {
    if (!voted) vote(question.id, choice)
  }

  const handleShare = async () => {
    const pct = result ? `${result.percent_a}% vs ${result.percent_b}%` : 'Vote now!'
    await Share.share({
      message: `"${question.text}" — ${pct}\n\nVote on What Would You Pick?`,
    })
  }

  // First personality tag for user's chosen option
  const choiceTag = myChoice === 'a' ? question.tags?.[0] : question.tags?.[1]

  return (
    <View style={styles.card}>
      {/* Category + Daily badge */}
      {question.category && (
        <View style={styles.topRow}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryEmoji}>{question.category.emoji}</Text>
            <Text style={styles.categoryName}>{question.category.name}</Text>
          </View>
          {isDaily && (
            <View style={styles.dailyPill}>
              <Text style={styles.dailyText}>Today's Pick</Text>
            </View>
          )}
        </View>
      )}

      {/* Question */}
      <Text style={styles.question}>{question.text}</Text>

      {/* Options or Results */}
      <View style={styles.options}>
        {!voted ? (
          <>
            <OptionButton choice="a" label={question.option_a} onPress={handleVote} disabled={isVoting} />
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            <OptionButton choice="b" label={question.option_b} onPress={handleVote} disabled={isVoting} />
            {isVoting && <ActivityIndicator color={colors.primary} style={styles.loader} />}
          </>
        ) : result ? (
          <>
            <ResultBar
              choice="a"
              label={question.option_a}
              percent={result.percent_a}
              isMyChoice={myChoice === 'a'}
              totalVotes={result.total_votes}
            />
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>vs</Text>
              <View style={styles.dividerLine} />
            </View>
            <ResultBar
              choice="b"
              label={question.option_b}
              percent={result.percent_b}
              isMyChoice={myChoice === 'b'}
              totalVotes={result.total_votes}
            />
            {myChoice && choiceTag && <PersonalityTag tag={choiceTag} />}
            <Text style={styles.voteCount}>
              {result.total_votes.toLocaleString()} votes worldwide
            </Text>
          </>
        ) : (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </View>

      {/* Post-vote actions */}
      {voted && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
          {onNext && (
            <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryEmoji: {
    fontSize: fontSize.sm,
  },
  categoryName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dailyPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  dailyText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    color: colors.text,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  options: {
    gap: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  voteCount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: fontWeight.medium,
  },
  loader: {
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  shareBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  shareBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: colors.black,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
})
