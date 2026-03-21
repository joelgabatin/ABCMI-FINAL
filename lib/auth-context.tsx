"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

type UserRole = 'member' | 'admin' | 'super_admin' | 'pastor'

interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: AppUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>
  loginWithGoogle: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAdmin: boolean
  isSuperAdmin: boolean
  isPastor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function toAppUser(user: User, profile?: { name?: string; role?: UserRole; avatar_url?: string } | null): AppUser {
  return {
    id: user.id,
    name: profile?.name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
    email: user.email ?? '',
    role: profile?.role ?? 'member',
    avatar: profile?.avatar_url ?? user.user_metadata?.avatar_url,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  async function loadProfile(supabaseUser: User) {
    const meta = supabaseUser.user_metadata
    const isOAuth = supabaseUser.app_metadata?.provider === 'google'

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role, avatar_url')
      .eq('id', supabaseUser.id)
      .single()

    // Sync Google name/avatar on every OAuth login — never overwrite role
    if (isOAuth) {
      const updates = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: meta?.full_name ?? meta?.name ?? profile?.name,
        avatar_url: meta?.avatar_url ?? meta?.picture ?? profile?.avatar_url,
      }
      await supabase.from('profiles').upsert(updates)
      setUser(toAppUser(supabaseUser, { ...updates, role: profile?.role ?? 'member' }))
    } else {
      const { data: roleData } = await supabase.rpc('get_my_role')
      const resolvedRole = (roleData as UserRole) ?? profile?.role ?? 'member'
      setUser(toAppUser(supabaseUser, { ...profile, role: resolvedRole }))
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        await loadProfile(session.user)
      }
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (session?.user) {
          loadProfile(session.user)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }

    // Use SECURITY DEFINER RPC to bypass RLS and reliably fetch role
    const { data: roleData } = await supabase.rpc('get_my_role')
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role, avatar_url')
      .eq('id', data.user.id)
      .single()

    const resolvedRole = (roleData as UserRole) ?? profile?.role ?? 'member'
    const appUser = toAppUser(data.user, { ...profile, role: resolvedRole })
    setUser(appUser)
    return { success: true, role: resolvedRole }
  }

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    })
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) return { success: false, error: error.message }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        email,
        role: 'member',
      })
    }
    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
      isSuperAdmin: user?.role === 'super_admin',
      isPastor: user?.role === 'pastor',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
