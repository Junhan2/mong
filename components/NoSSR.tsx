'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function NoSSR({ children, fallback }: NoSSRProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      fallback || (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-black border border-gray-800 rounded-full px-6 py-3 flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span className="text-white">Loading...</span>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}