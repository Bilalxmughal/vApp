import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, fontSize, fontWeight, spacing } from '../../theme'

interface StreakBadgeProps {
  streak: number
  size?: 'sm' | 'md'
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  if (streak === 0) return null
  const sm = size === 'sm'

  return (
    <View style={[styles.container, sm && styles.containerSm]}>
      <Text style={[styles.fire, sm && styles.fireSm]}>🔥</Text>
      <Text style={[styles.count, sm && styles.countSm]}>{streak}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: 3,
  },
  containerSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  fire: { fontSize: fontSize.md },
  fireSm: { fontSize: fontSize.sm },
  count: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.orange,
  },
  countSm: { fontSize: fontSize.sm },
})
