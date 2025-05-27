'use client'

import { motion } from 'framer-motion'
import { User, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

const snappyTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
}

interface UserProfileProps {
  onClose: () => void
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  if (loading) {
    return (
      <motion.div
        className="fixed top-4 right-4 bg-black border border-gray-800 rounded-2xl p-4 min-w-[200px] z-50"
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={snappyTransition}
      >
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="fixed top-4 right-4 bg-black border border-gray-800 rounded-2xl p-4 min-w-[250px] z-50"
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={snappyTransition}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-black" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">
            {user?.user_metadata?.display_name || user?.user_metadata?.full_name || '사용자'}
          </p>
          <p className="text-gray-400 text-xs">{user?.email}</p>
        </div>
      </div>
      
      <Button
        onClick={handleSignOut}
        variant="ghost"
        className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 p-2 h-auto"
      >
        <LogOut className="h-4 w-4 mr-2" />
        로그아웃
      </Button>
    </motion.div>
  )
}