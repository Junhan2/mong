'use client'

import dynamic from 'next/dynamic'
import NoSSR from './NoSSR'

// 클라이언트에서만 렌더링되는 컴포넌트
const DynamicIslandTodoClient = dynamic(
  () => import('./DynamicIslandTodo'),
  {
    ssr: false,
    loading: () => null // NoSSR에서 로딩 처리
  }
)

export default function DynamicIslandTodoWrapper() {
  return (
    <NoSSR>
      <DynamicIslandTodoClient />
    </NoSSR>
  )
}