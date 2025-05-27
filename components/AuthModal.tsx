'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import SocialButton from './SocialButton'

const snappyTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
}

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            }
          }
        })
        if (error) throw error
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'github' | 'kakao') => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      if (error) {
        // OAuth 설정이 안된 경우 친화적인 메시지
        if (error.status === 400) {
          throw new Error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} 로그인이 아직 설정되지 않았습니다. 이메일/비밀번호로 로그인해주세요.`)
        }
        throw error
      }
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={snappyTransition}
    >
      <motion.div
        className="bg-black border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={snappyTransition}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? '로그인' : '회원가입'}
          </h1>
          <p className="text-gray-400">
            Mong에 오신 것을 환영합니다
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="이름"
                className="w-full bg-[#111111] border-[#222222] text-gray-200 placeholder:text-gray-500 pl-10 h-12"
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          )}

          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full bg-[#111111] border-[#222222] text-gray-200 placeholder:text-gray-500 pl-10 h-12"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full bg-[#111111] border-[#222222] text-gray-200 placeholder:text-gray-500 pl-10 pr-10 h-12"
              required
              minLength={6}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12 rounded-lg"
          >
            {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <Separator className="flex-1 bg-gray-700" />
          <span className="px-4 text-gray-400 text-sm">또는</span>
          <Separator className="flex-1 bg-gray-700" />
        </div>

        <div className="space-y-3">
          <SocialButton
            provider="google"
            onClick={() => handleSocialAuth('google')}
            loading={loading}
          />

          <SocialButton
            provider="github"
            onClick={() => handleSocialAuth('github')}
            loading={loading}
          />

          <SocialButton
            provider="kakao"
            onClick={() => handleSocialAuth('kakao')}
            loading={loading}
          />
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => {
              // 데모 모드로 전환 (로컬 스토리지 플래그 설정)
              localStorage.setItem('demo_mode', 'true')
              window.location.reload()
            }}
            className="text-gray-400 border-gray-700 hover:text-white hover:border-gray-600"
          >
            🚀 데모 모드로 체험하기
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}