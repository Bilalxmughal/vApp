import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontSize, fontWeight, spacing, radius } from '../../theme'

const CATEGORIES = [
  { slug: 'money',         name: 'Money',         emoji: '💰' },
  { slug: 'travel',        name: 'Travel',        emoji: '✈️' },
  { slug: 'food',          name: 'Food',          emoji: '🍔' },
  { slug: 'relationships', name: 'Relationships', emoji: '❤️' },
  { slug: 'career',        name: 'Career',        emoji: '💼' },
  { slug: 'lifestyle',     name: 'Lifestyle',     emoji: '🌟' },
  { slug: 'funny',         name: 'Funny',         emoji: '😂' },
  { slug: 'cars',          name: 'Cars',          emoji: '🚗' },
  { slug: 'dating',        name: 'Dating',        emoji: '💘' },
  { slug: 'movies',        name: 'Movies & TV',   emoji: '🎬' },
  { slug: 'sports',        name: 'Sports',        emoji: '🏆' },
  { slug: 'luxury',        name: 'Luxury',        emoji: '💎' },
  { slug: 'adventure',     name: 'Adventure',     emoji: '🏔️' },
  { slug: 'weird',         name: 'Weird',         emoji: '🤯' },
  { slug: 'family',        name: 'Family',        emoji: '👨‍👩‍👧' },
  { slug: 'friendship',    name: 'Friendship',    emoji: '🤝' },
]

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>16 categories · 500+ questions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.slug} style={styles.card} activeOpacity={0.8}>
            <Text style={styles.emoji}>{cat.emoji}</Text>
            <Text style={styles.name}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: fontWeight.medium,
  },
  grid: {
    padding: spacing.base,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  emoji: { fontSize: 28 },
  name: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
})
