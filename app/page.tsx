'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState<string[]>([])

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()])
      setNewTodo('')
    }
  }

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index))
  }

  const snappyTransition = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 1,
  }

  // 인증 로딩 중일 때
  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-black">
        <div className="bg-black border border-gray-800 rounded-full px-6 py-3 flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">로딩 중...</span>
        </div>
      </main>
    )
  }

  // 인증되지 않은 사용자일 때
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-black">
        <div className="bg-black border border-gray-800 rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">Mong에 오신 것을 환영합니다</h1>
          <p className="text-gray-400 text-center mb-6">로그인이 필요합니다</p>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600"
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600"
            />
            <button className="w-full bg-yellow-500 text-black font-semibold py-3 rounded">
              로그인
            </button>
          </div>
          <p className="text-center text-gray-400 mt-4 text-sm">
            인증 테스트용 - 실제 로그인 기능은 비활성화됨
          </p>
        </div>
      </main>
    )
  }

  // 인증된 사용자 - 기존 할일 앱
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black">
      <motion.div
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        initial={false}
        animate={{
          width: isExpanded ? 300 : 200,
          height: isExpanded ? "auto" : 40,
          borderRadius: isExpanded ? 24 : 9999,
        }}
        transition={snappyTransition}
      >
        <motion.div
          className="bg-black text-white h-full cursor-pointer overflow-hidden rounded-[inherit] border border-gray-800"
          onClick={() => !isExpanded && setIsExpanded(true)}
          layout
          transition={snappyTransition}
        >
          {!isExpanded ? (
            <div className="p-2 flex items-center justify-between h-full">
              <span className="font-semibold">Mong Todo</span>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {todos.length}
                </span>
                <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={snappyTransition}
              className="p-4"
            >
              <div className="flex mb-4 gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="할일 추가"
                  className="flex-1 p-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <button
                  onClick={addTodo}
                  className="bg-yellow-500 text-black px-3 py-2 rounded font-medium"
                >
                  +
                </button>
              </div>

              <AnimatePresence>
                {todos.map((todo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={snappyTransition}
                    className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded"
                  >
                    <span className="text-sm text-yellow-500">{todo}</span>
                    <button
                      onClick={() => removeTodo(index)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={() => setIsExpanded(false)}
                className="mt-4 w-full p-2 text-gray-400 hover:text-white transition-colors"
              >
                닫기
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </main>
  )
}
