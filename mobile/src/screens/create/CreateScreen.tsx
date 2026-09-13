import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { colors, fontSize, fontWeight, spacing, radius } from '../../theme'

export default function CreateScreen() {
  const { user, isGuest } = useAuthStore()

  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit =
    questionText.trim().length >= 10 &&
    optionA.trim().length >= 2 &&
    optionB.trim().length >= 2 &&
    !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    if (isGuest || !user) {
      Alert.alert('Account required', 'Create a free account to submit questions.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.from('questions').insert({
      text: questionText.trim(),
      option_a: optionA.trim(),
      option_b: optionB.trim(),
      is_user_generated: true,
      created_by: user.id,
      moderation_status: 'pending',
      status: 'draft',
    })
    setSubmitting(false)

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    setSubmitted(true)
  }

  const handleReset = () => {
    setQuestionText('')
    setOptionA('')
    setOptionB('')
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Question Submitted!</Text>
          <Text style={styles.successBody}>
            Our team will review it shortly. Approved questions go live for everyone to vote on.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleReset} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Submit Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ask the World</Text>
          <Text style={styles.headerSub}>Submit a Would You Rather question</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Question */}
          <View style={styles.field}>
            <Text style={styles.label}>Your Question</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Would you rather…"
              placeholderTextColor={colors.textMuted}
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              maxLength={200}
              returnKeyType="next"
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{questionText.length}/200</Text>
          </View>

          {/* Options */}
          <View style={styles.field}>
            <Text style={styles.label}>Option A</Text>
            <TextInput
              style={styles.input}
              placeholder="First option"
              placeholderTextColor={colors.textMuted}
              value={optionA}
              onChangeText={setOptionA}
              maxLength={120}
              returnKeyType="next"
            />
          </View>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Option B</Text>
            <TextInput
              style={styles.input}
              placeholder="Second option"
              placeholderTextColor={colors.textMuted}
              value={optionB}
              onChangeText={setOptionB}
              maxLength={120}
              returnKeyType="done"
            />
          </View>

          {/* Guidelines */}
          <View style={styles.guide}>
            <Text style={styles.guideTitle}>Guidelines</Text>
            <Text style={styles.guideItem}>• Keep it fun, thought-provoking, or relatable</Text>
            <Text style={styles.guideItem}>• Two clear, distinct options</Text>
            <Text style={styles.guideItem}>• No offensive, political, or harmful content</Text>
            <Text style={styles.guideItem}>• Questions are reviewed before going live</Text>
          </View>

          {(isGuest || !user) ? (
            <View style={styles.guestNote}>
              <Text style={styles.guestNoteText}>
                Create a free account to submit questions.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Submit Question</Text>
              )}
            </TouchableOpacity>
          )}

          <View style={{ height: spacing['3xl'] }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
    color: colors.text,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },

  form: {
    padding: spacing.xl,
    gap: spacing.lg,
  },

  field: { gap: spacing.sm },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.black,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text,
  },

  textarea: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text,
    minHeight: 90,
  },

  charCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'right',
    fontWeight: fontWeight.medium,
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: -spacing.sm,
  },
  orLine: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.black,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },

  guide: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.base,
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  guideTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.black,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  guideItem: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.5,
  },

  guestNote: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
  },
  guestNoteText: {
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },

  primaryBtn: {
    backgroundColor: colors.black,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },

  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
    gap: spacing.lg,
  },
  successEmoji: { fontSize: 56 },
  successTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    color: colors.text,
    letterSpacing: -0.5,
  },
  successBody: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
  },
})
