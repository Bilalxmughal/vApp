import React, { useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native'
import ViewShot from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'
import { Share2 } from 'lucide-react-native'
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme'
import { Question, VoteChoice, VoteResult } from '../../types'

interface ShareCardProps {
  question: Question
  choice: VoteChoice
  result: VoteResult
}

export function ShareCard({ question, choice, result }: ShareCardProps) {
  const shotRef = useRef<ViewShot>(null)

  const handleShare = async () => {
    try {
      const uri = await (shotRef.current as any).capture()
      const canShare = await Sharing.isAvailableAsync()
      if (!canShare) {
        Alert.alert('Sharing not available on this device')
        return
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your pick!',
      })
    } catch {
      Alert.alert('Could not share. Try again.')
    }
  }

  const chosenLabel = choice === 'a' ? question.option_a : question.option_b
  const otherLabel  = choice === 'a' ? question.option_b : question.option_a
  const chosenPct   = choice === 'a' ? result.percent_a : result.percent_b
  const otherPct    = choice === 'a' ? result.percent_b : result.percent_a

  return (
    <View style={styles.wrapper}>
      {/* Captured card */}
      <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
        <View style={styles.card}>
          <Text style={styles.appTag}>What Would You Pick?</Text>

          <Text style={styles.question}>{question.text}</Text>

          {/* Chosen option */}
          <View style={[styles.optionRow, styles.chosenRow]}>
            <View style={styles.chosenBadge}>
              <Text style={styles.chosenBadgeText}>
                {choice.toUpperCase()} · My Pick
              </Text>
            </View>
            <Text style={styles.optionLabel} numberOfLines={2}>
              {chosenLabel}
            </Text>
            <Text style={styles.pct}>{chosenPct}%</Text>
          </View>

          {/* Other option */}
          <View style={styles.optionRow}>
            <View style={styles.otherBadge}>
              <Text style={styles.otherBadgeText}>
                {choice === 'a' ? 'B' : 'A'}
              </Text>
            </View>
            <Text style={[styles.optionLabel, styles.otherLabel]} numberOfLines={2}>
              {otherLabel}
            </Text>
            <Text style={[styles.pct, styles.otherPct]}>{otherPct}%</Text>
          </View>

          {/* Bar */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${chosenPct}%` as any }]} />
          </View>

          <Text style={styles.totalText}>
            {result.total_votes.toLocaleString()} picks so far
          </Text>
        </View>
      </ViewShot>

      {/* Share button */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
        <Share2 size={16} color={colors.white} strokeWidth={2.5} />
        <Text style={styles.shareBtnText}>Share My Pick</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },

  appTag: {
    fontSize: 10,
    fontWeight: fontWeight.black,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  question: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
    color: colors.text,
    letterSpacing: -0.3,
    lineHeight: fontSize.lg * 1.35,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chosenRow: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  chosenBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  chosenBadgeText: {
    fontSize: 9,
    fontWeight: fontWeight.black,
    color: colors.white,
    letterSpacing: 0.3,
  },

  otherBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.black,
    color: colors.textSecondary,
  },

  optionLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  otherLabel: { color: colors.textSecondary },

  pct: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.black,
    color: colors.primary,
    minWidth: 36,
    textAlign: 'right',
  },
  otherPct: { color: colors.textSecondary },

  barTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },

  totalText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.black,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
  },
  shareBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
})
