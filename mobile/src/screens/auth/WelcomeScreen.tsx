import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontSize, fontWeight, spacing, radius } from '../../theme'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

type Mode = 'landing' | 'sign_in' | 'sign_up'

export default function WelcomeScreen() {
  const [mode, setMode] = useState<Mode>('landing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setGuest } = useAuthStore()

  const handleSignIn = async () => {
    if (!email || !password) return
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (error) Alert.alert('Sign In Failed', error.message)
  }

  const handleSignUp = async () => {
    if (!email || !password) return
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setIsLoading(false)
    if (error) Alert.alert('Sign Up Failed', error.message)
    else Alert.alert('Check your email', 'We sent you a confirmation link.')
  }

  if (mode === 'landing') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.landing}>
          <View style={styles.logoArea}>
            <Text style={styles.logoEmoji}>🗳️</Text>
            <Text style={styles.appName}>What Would You Pick?</Text>
            <Text style={styles.tagline}>Pick one. See what the world thinks.</Text>
          </View>

          {/* Mini preview */}
          <View style={styles.preview}>
            <Text style={styles.previewQ}>$1 million today or $10k every month for life?</Text>
            <View style={styles.previewOptions}>
              <View style={styles.previewOption}>
                <View style={styles.previewLetter}><Text style={styles.previewLetterText}>A</Text></View>
                <Text style={styles.previewOptionText}>$1M Today</Text>
              </View>
              <View style={styles.previewDivider} />
              <View style={styles.previewOption}>
                <View style={styles.previewLetter}><Text style={styles.previewLetterText}>B</Text></View>
                <Text style={styles.previewOptionText}>$10k Monthly</Text>
              </View>
            </View>
            <View style={styles.previewResult}>
              <Text style={styles.previewResultText}>62% picked A · 38% picked B</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('sign_up')} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => setMode('sign_in')} activeOpacity={0.85}>
              <Text style={styles.outlineBtnText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={setGuest} activeOpacity={0.7}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => setMode('landing')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.formTitle}>
            {mode === 'sign_in' ? 'Welcome back' : 'Join the debate'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={mode === 'sign_up' ? 'new-password' : 'current-password'}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
            onPress={mode === 'sign_in' ? handleSignIn : handleSignUp}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.primaryBtnText}>{mode === 'sign_in' ? 'Sign In' : 'Create Account'}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in')}>
            <Text style={styles.switchText}>
              {mode === 'sign_in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  landing: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing['3xl'],
  },
  logoArea: { alignItems: 'center', gap: spacing.sm },
  logoEmoji: { fontSize: 52 },
  appName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  preview: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  previewQ: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  previewOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  previewOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  previewLetter: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLetterText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.black,
    color: colors.white,
  },
  previewOptionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    flex: 1,
  },
  previewDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  previewResult: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previewResultText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  actions: { gap: spacing.md },
  primaryBtn: {
    backgroundColor: colors.black,
    borderRadius: radius.xl,
    paddingVertical: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryBtnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: colors.black,
    borderRadius: radius.xl,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  guestText: {
    textAlign: 'center',
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  btnDisabled: { opacity: 0.6 },
  formContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    gap: spacing.md,
  },
  backBtn: { marginBottom: spacing.md },
  backText: {
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  formTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  switchText: {
    textAlign: 'center',
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: fontWeight.medium,
    marginTop: spacing.sm,
  },
})
