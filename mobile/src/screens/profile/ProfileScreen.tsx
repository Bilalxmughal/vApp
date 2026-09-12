import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Star, Bell, Lock, HelpCircle, FileText, LogOut, ChevronRight,
} from 'lucide-react-native'
import { colors, fontSize, fontWeight, spacing, radius } from '../../theme'
import { useAuthStore } from '../../store/authStore'
import { useQuestionStore } from '../../store/questionStore'
import { StreakBadge } from '../../components/profile/StreakBadge'

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

type LucideIcon = React.ComponentType<{ size: number; color: string; strokeWidth?: number }>

function SettingsRow({
  Icon,
  label,
  value,
  onPress,
  danger,
}: {
  Icon: LucideIcon
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
}) {
  const iconColor = danger ? '#ef4444' : colors.textSecondary
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.75 : 1}>
      <Icon size={18} color={iconColor} strokeWidth={2} />
      <Text style={[styles.rowLabel, danger && styles.rowDanger]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && <ChevronRight size={16} color={colors.gray400} strokeWidth={2} />}
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const { profile, user, isGuest, signOut, exitGuest } = useAuthStore()
  const { votedQuestions } = useQuestionStore()

  const totalVoted = Object.keys(votedQuestions).length
  const streak = profile?.streak_current ?? 0
  const longestStreak = profile?.streak_longest ?? 0
  const totalVotesAll = profile?.total_votes ?? totalVoted

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ])
  }

  const displayName = profile?.username ?? user?.email?.split('@')[0] ?? 'Guest'

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar + name */}
        <View style={styles.avatar}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {displayName[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.username}>{displayName}</Text>
          {isGuest ? (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>Guest</Text>
            </View>
          ) : profile?.is_premium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>⭐ Premium</Text>
            </View>
          ) : null}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard value={totalVotesAll.toLocaleString()} label="Total Votes" />
          <View style={styles.statDivider} />
          <StatCard value={streak} label="Current Streak" />
          <View style={styles.statDivider} />
          <StatCard value={longestStreak} label="Best Streak" />
        </View>

        {/* Streak section */}
        {streak > 0 && (
          <View style={styles.streakSection}>
            <StreakBadge streak={streak} size="md" />
            <Text style={styles.streakText}>
              {streak} day{streak > 1 ? 's' : ''} in a row! Keep it going 🔥
            </Text>
          </View>
        )}

        {/* Personality — Phase 3 placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Personality</Text>
          <View style={styles.personalityPlaceholder}>
            <Text style={styles.personalityEmoji}>🧠</Text>
            <Text style={styles.personalityTitle}>Unlock after 20 votes</Text>
            <Text style={styles.personalitySubtitle}>
              Your choices reveal surprising things about you.
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((totalVotesAll / 20) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.min(totalVotesAll, 20)}/20 votes</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsGroup}>
            {!isGuest && !profile?.is_premium && (
              <SettingsRow Icon={Star} label="Upgrade to Premium" value="$2.99/mo" onPress={() => {}} />
            )}
            <SettingsRow Icon={Bell} label="Notifications" value="On" onPress={() => {}} />
            <SettingsRow Icon={Lock} label="Privacy" onPress={() => {}} />
            <SettingsRow Icon={HelpCircle} label="Help & Feedback" onPress={() => {}} />
            <SettingsRow Icon={FileText} label="Terms of Service" onPress={() => {}} />
          </View>
        </View>

        {/* Sign out */}
        {!isGuest && (
          <View style={styles.section}>
            <View style={styles.settingsGroup}>
              <SettingsRow Icon={LogOut} label="Sign Out" onPress={handleSignOut} danger />
            </View>
          </View>
        )}

        {isGuest && (
          <View style={styles.guestCTA}>
            <Text style={styles.guestCTATitle}>Create an account</Text>
            <Text style={styles.guestCTABody}>
              Save your streak, unlock personality insights, and see how your picks compare.
            </Text>
            <TouchableOpacity style={styles.guestCTABtn} onPress={exitGuest} activeOpacity={0.85}>
              <Text style={styles.guestCTABtnText}>Create Free Account</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  avatar: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.black,
    color: colors.white,
  },
  username: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    color: colors.text,
    letterSpacing: -0.3,
  },
  guestBadge: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  guestBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  premiumBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#d97706',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    color: colors.text,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#fff7ed',
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
  },
  streakText: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  section: { gap: spacing.md },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.black,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  personalityPlaceholder: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  personalityEmoji: { fontSize: 36 },
  personalityTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  personalitySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  rowLabel: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  rowDanger: { color: '#ef4444' },
  rowValue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  guestCTA: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
  },
  guestCTATitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
    color: colors.text,
  },
  guestCTABody: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    lineHeight: fontSize.base * 1.5,
  },
  guestCTABtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  guestCTABtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
})
