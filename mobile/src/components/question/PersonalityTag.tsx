import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, fontSize, fontWeight, spacing } from '../../theme'

const tagMap: Record<string, { label: string; emoji: string }> = {
  risk_taker:        { label: 'Risk Taker',         emoji: '🎲' },
  practical:         { label: 'Practical Thinker',  emoji: '🧠' },
  adventurous:       { label: 'Adventurer',          emoji: '🌍' },
  homebody:          { label: 'Homebody',            emoji: '🏠' },
  money_minded:      { label: 'Money-Minded',        emoji: '💰' },
  experience_driven: { label: 'Experience Seeker',  emoji: '✨' },
  social:            { label: 'Social Butterfly',   emoji: '🦋' },
  independent:       { label: 'Independent',         emoji: '💪' },
  planner:           { label: 'Strategic Planner',  emoji: '📋' },
  spontaneous:       { label: 'Spontaneous',         emoji: '⚡' },
  romantic:          { label: 'Romantic',            emoji: '❤️' },
  career_driven:     { label: 'Career-Driven',       emoji: '🚀' },
  foodie:            { label: 'Foodie',              emoji: '🍽️' },
  thrill_seeker:     { label: 'Thrill Seeker',       emoji: '🎢' },
  luxury_lover:      { label: 'Luxury Lover',        emoji: '💎' },
  minimalist:        { label: 'Minimalist',          emoji: '✂️' },
}

interface PersonalityTagProps {
  tag: string
}

export function PersonalityTag({ tag }: PersonalityTagProps) {
  const info = tagMap[tag] ?? { label: tag, emoji: '✦' }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{info.emoji}</Text>
      <View>
        <Text style={styles.eyebrow}>That makes you a</Text>
        <Text style={styles.label}>{info.label}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    padding: spacing.base,
    borderRadius: radius.lg,
  },
  emoji: {
    fontSize: 28,
  },
  eyebrow: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: 1,
  },
})
