'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SocialButtonProps {
  provider: 'google' | 'github' | 'kakao'
  onClick: () => Promise<void>
  loading: boolean
}

const providerConfig = {
  google: {
    name: 'Google',
    icon: '🔍',
    bgColor: 'bg-white hover:bg-gray-100',
    textColor: 'text-gray-900'
  },
  github: {
    name: 'GitHub',
    icon: '⚫',
    bgColor: 'bg-gray-900 hover:bg-gray-800',
    textColor: 'text-white'
  },
  kakao: {
    name: 'Kakao',
    icon: '💬',
    bgColor: 'bg-yellow-400 hover:bg-yellow-500',
    textColor: 'text-gray-900'
  }
}

export default function SocialButton({ provider, onClick, loading }: SocialButtonProps) {
  const config = providerConfig[provider]
  
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={`w-full h-12 ${config.bgColor} ${config.textColor} font-medium rounded-lg transition-colors`}
      variant="outline"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <span className="mr-2">{config.icon}</span>
      )}
      {config.name}으로 {loading ? '로그인 중...' : '로그인'}
    </Button>
  )
}
