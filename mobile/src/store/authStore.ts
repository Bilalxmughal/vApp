import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'
import { Profile } from '../types'
import { supabase } from '../lib/supabase'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  isGuest: boolean
  isLoading: boolean

  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setGuest: () => void
  exitGuest: () => void
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isGuest: false,
  isLoading: true,

  setSession: (session) => {
    set({ session, user: session?.user ?? null, isGuest: false })
  },

  setProfile: (profile) => set({ profile }),

  setGuest: () => set({ session: null, user: null, profile: null, isGuest: true }),

  exitGuest: () => set({ isGuest: false }),

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) set({ profile: data as Profile })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null, profile: null, isGuest: false })
  },
}))

// Derived selector — avoids re-render if isPremium doesn't change
export const selectIsPremium = (s: AuthState) => s.profile?.is_premium ?? false
