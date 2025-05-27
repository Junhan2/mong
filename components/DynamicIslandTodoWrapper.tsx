'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// 클라이언트에서만 렌더링되는 컴포넌트로 감싸기
const DynamicIslandTodoClient = dynamic(
  () => import('./DynamicIslandTodo'),
  {
    ssr: false, // 서버사이드 렌더링 비활성화
    loading: () => (
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-black border border-gray-800 rounded-full px-6 py-3 flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <span className="text-white">로딩 중...</span>
        </div>
      </div>
    )
  }
)

export default DynamicIslandTodoClient