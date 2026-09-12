import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { colors, radius, fontSize, fontWeight, spacing } from '../../theme'
import { VoteChoice } from '../../types'

interface ResultBarProps {
  choice: VoteChoice
  label: string
  percent: number
  isMyChoice: boolean
  totalVotes: number
}

export function ResultBar({ choice, label, percent, isMyChoice }: ResultBarProps) {
  const width = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(width, { toValue: percent, duration: 650, delay: 80, useNativeDriver: false }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start()
  }, [percent])

  // User's choice gets the primary fill; other option gets gray
  const fillColor = isMyChoice ? colors.primary : colors.gray200

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Background fill bar */}
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: fillColor },
          {
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.left}>
          <View style={[styles.letter, isMyChoice && styles.letterActive]}>
            <Text style={[styles.letterText, isMyChoice && styles.letterTextActive]}>
              {choice.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.label, isMyChoice && styles.labelBold]} numberOfLines={1}>
            {label}
          </Text>
          {isMyChoice && (
            <View style={styles.myPill}>
              <Text style={styles.myPillText}>✓ You</Text>
            </View>
          )}
        </View>
        <Text style={[styles.percent, isMyChoice && styles.percentActive]}>{percent}%</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
    minHeight: 62,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    opacity: 0.15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  letter: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  letterActive: {
    backgroundColor: colors.primary,
  },
  letterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
    color: colors.gray600,
  },
  letterTextActive: {
    color: colors.white,
  },
  label: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  labelBold: {
    fontWeight: fontWeight.bold,
  },
  myPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  myPillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  percent: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    color: colors.gray600,
    minWidth: 48,
    textAlign: 'right',
  },
  percentActive: {
    color: colors.primary,
  },
})
