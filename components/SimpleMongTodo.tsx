'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { todoService, type Todo } from '@/lib/supabase'

const snappyTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
}

export default function SimpleMongTodo() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // 할일 로드
  useEffect(() => {
    if (user) {
      loadTodos()
    }
  }, [user])

  const loadTodos = async () => {
    try {
      setIsLoading(true)
      const data = await todoService.getTodos()
      setTodos(data)
    } catch (error) {
      console.error('Failed to load todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    try {
      await todoService.addTodo(newTodo.trim())
      setNewTodo('')
      loadTodos() // 새로고침
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      await todoService.toggleTodo(id, !todo.completed)
      loadTodos() // 새로고침
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const removeTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id)
      loadTodos() // 새로고침
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const completedTodos = todos.filter(todo => todo.completed).length
  const remainingTodos = todos.length - completedTodos

  // 인증 로딩 중
  if (authLoading) {
    return (
      <motion.div
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black border border-gray-800 rounded-full px-6 py-3 flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">로딩 중...</span>
        </div>
      </motion.div>
    )
  }

  // 인증되지 않은 사용자
  if (!user) {
    return (
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-black border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h1 className="text-2xl font-bold text-white mb-4 text-center">Mong</h1>
          <p className="text-gray-400 text-center mb-6">
            아름다운 할일 관리 앱에 오신 것을 환영합니다
          </p>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              데모 버전 - 실제 로그인은 개발 중입니다
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              체험해보기
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // 메인 할일 관리 UI
  return (
    <>
      <motion.div
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        initial={false}
        animate={{
          width: isExpanded ? 320 : 200,
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
              <span className="font-semibold">Mong</span>
              <div className="flex items-center space-x-2">
                {remainingTodos > 0 && (
                  <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {remainingTodos}
                  </span>
                )}
                {completedTodos > 0 && (
                  <span className="bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {completedTodos}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowProfile(!showProfile)
                  }}
                  className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors text-xs"
                >
                  👤
                </button>
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
                  placeholder="새로운 할일"
                  className="flex-1 p-2 bg-gray-800 text-white rounded border border-gray-600 text-sm"
                />
                <button
                  onClick={addTodo}
                  disabled={!newTodo.trim()}
                  className="bg-yellow-500 text-black px-3 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-4">
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {todos.map((todo) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={snappyTransition}
                        className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded"
                      >
                        <span 
                          className={`text-sm flex-1 cursor-pointer ${
                            todo.completed 
                              ? "text-gray-500 line-through" 
                              : "text-yellow-500"
                          }`}
                          onClick={() => toggleTodo(todo.id)}
                        >
                          {todo.text}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className="text-gray-400 hover:text-white text-sm px-2 py-1"
                          >
                            {todo.completed ? "↶" : "✓"}
                          </button>
                          <button
                            onClick={() => removeTodo(todo.id)}
                            className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {todos.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      할일이 없습니다.<br />새로운 할일을 추가해보세요!
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsExpanded(false)}
                className="mt-4 w-full p-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                닫기
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* 프로필 메뉴 */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="fixed top-4 right-4 bg-black border border-gray-800 rounded-2xl p-4 min-w-[200px] z-50"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={snappyTransition}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                {user?.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-white font-medium text-sm">사용자</p>
                <p className="text-gray-400 text-xs">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                signOut()
                setShowProfile(false)
              }}
              className="w-full text-left text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded transition-colors text-sm"
            >
              로그아웃
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 외부 클릭 시 프로필 닫기 */}
      {showProfile && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfile(false)}
        />
      )}
    </>
  )
}
