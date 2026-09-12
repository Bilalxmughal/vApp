import React, { useCallback, useRef } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native'
import { colors, radius, fontSize, fontWeight, spacing } from '../../theme'
import { VoteChoice } from '../../types'

interface OptionButtonProps {
  choice: VoteChoice
  label: string
  onPress: (choice: VoteChoice) => void
  disabled?: boolean
}

export function OptionButton({ choice, label, onPress, disabled }: OptionButtonProps) {
  const scale = useRef(new Animated.Value(1)).current

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 70, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start()
    onPress(choice)
  }, [choice, onPress, scale])

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.82}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText}>{choice.toUpperCase()}</Text>
        </View>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    minHeight: 68,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.6,
  },
  letter: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  letterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
    color: colors.textInverse,
    letterSpacing: 1,
  },
  label: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    lineHeight: fontSize.base * 1.35,
  },
})
