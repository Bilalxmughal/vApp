import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ActivityIndicator, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { AuthNavigator } from './AuthNavigator'
import { TabNavigator } from './TabNavigator'
import { colors } from '../theme'

export function AppNavigator() {
  const { session, isGuest, setSession, refreshProfile } = useAuthStore()
  const [bootstrapping, setBootstrapping] = useState(true)

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) refreshProfile()
      setBootstrapping(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) refreshProfile()
    })

    return () => subscription.unsubscribe()
  }, [])

  if (bootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  const isAuthenticated = !!session || isGuest

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
