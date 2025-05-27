'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    setMounted(true)
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    let isSubscribed = true
    
    // 현재 세션 가져오기
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          return
        }
        
        if (isSubscribed && mountedRef.current) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getSession:', error)
        if (isSubscribed && mountedRef.current) {
          setLoading(false)
        }
      }
    }

    getSession()

    // 인증 상태 변경 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isSubscribed && mountedRef.current) {
          console.log('Auth state changed:', event, session?.user?.email)
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      isSubscribed = false
      subscription.unsubscribe()
    }
  }, [mounted])

  const signOut = async () => {
    try {
      // 즉시 로컬 상태 업데이트
      if (mountedRef.current) {
        setUser(null)
        setSession(null)
      }
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        // 오류 발생시에도 로컬 상태는 이미 null로 설정됨
      }
    } catch (error) {
      console.error('Error in signOut:', error)
      // 오류 발생시에도 로컬 상태는 이미 null로 설정됨
    }
  }

  // 마운트되기 전에는 로딩 표시
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, session: null, loading: true, signOut }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}