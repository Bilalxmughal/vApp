import React, { useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontSize, fontWeight, spacing, radius } from '../../theme'
import { QuestionCard } from '../../components/question/QuestionCard'
import { StreakBadge } from '../../components/profile/StreakBadge'
import { useDailyQuestion, useRandomQuestions } from '../../hooks/useQuestions'
import { useAuthStore } from '../../store/authStore'
import { useQuestionStore } from '../../store/questionStore'

export default function HomeScreen() {
  const { profile } = useAuthStore()
  const { dailyQuestion, isLoading: dailyLoading } = useDailyQuestion()
  const { isLoading: feedLoading } = useRandomQuestions(10)
  const { feedQuestions, currentFeedIndex, advanceFeed } = useQuestionStore()

  const currentFeedQuestion = feedQuestions[currentFeedIndex] ?? null
  const streak = profile?.streak_current ?? 0

  const onNextFeedQuestion = useCallback(() => advanceFeed(), [advanceFeed])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>What Would You Pick?</Text>
          <Text style={styles.subtitle}>Pick one. See what the world thinks.</Text>
        </View>
        {streak > 0 && <StreakBadge streak={streak} />}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Question */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Today's Question</Text>
            <View style={styles.liveDot} />
          </View>

          {dailyLoading ? (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Loading…</Text>
            </View>
          ) : dailyQuestion ? (
            <QuestionCard question={dailyQuestion} isDaily />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No daily question scheduled yet.</Text>
            </View>
          )}
        </View>

        {/* Quick Pick Feed */}
        {currentFeedQuestion && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Quick Pick</Text>
              <Text style={styles.feedCounter}>
                {Math.min(currentFeedIndex + 1, feedQuestions.length)}/{feedQuestions.length}
              </Text>
            </View>
            <QuestionCard
              question={currentFeedQuestion}
              onNext={currentFeedIndex < feedQuestions.length - 1 ? onNextFeedQuestion : undefined}
            />
          </View>
        )}

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  appName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.base,
    gap: spacing.xl,
  },
  section: { gap: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.black,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  feedCounter: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
    marginLeft: 'auto',
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
})
