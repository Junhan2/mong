"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pencil, Plus, X, Check, RotateCcw, Loader2, User as UserIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { todoService, type Todo } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import AuthModal from "./AuthModal"
import UserProfile from "./UserProfile"
import MongLogo from "./MongLogo"

const snappyTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
}

export default function MongTodo() {
  const { user, loading: authLoading } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 초기 데이터 로드 및 실시간 구독 - 항상 실행
  useEffect(() => {
    // 인증된 사용자가 아니면 초기화하지 않음
    if (!user) {
      setIsLoading(false)
      return
    }

    let subscription: { unsubscribe: () => void } | null = null
    let mounted = true

    const loadTodos = async () => {
      try {
        setIsLoading(true)
        const data = await todoService.getTodos()
        if (mounted) {
          setTodos(data)
          setError(null)
        }
      } catch (error) {
        console.error('Failed to load todos:', error)
        if (mounted) {
          setError('할일을 불러오는데 실패했습니다.')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // 실시간 구독 설정
    const setupSubscription = () => {
      if (mounted) {
        subscription = todoService.subscribeToTodos((newTodos) => {
          if (mounted) {
            setTodos(newTodos)
          }
        })
      }
    }

    const initializeData = async () => {
      await loadTodos()
      if (mounted) {
        setupSubscription()
      }
    }

    initializeData().catch((error) => {
      console.error('Failed to initialize data:', error)
      if (mounted) {
        setError('초기화에 실패했습니다.')
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      if (subscription && typeof subscription.unsubscribe === 'function') {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.error('Failed to unsubscribe:', error)
        }
      }
    }
  }, [user]) // user를 의존성 배열에 추가

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && !(event.target as Element).closest(".mong-todo")) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // 로딩 중이거나 인증되지 않은 경우의 렌더링
  if (authLoading) {
    return (
      <motion.div
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black border border-gray-800 rounded-full px-6 py-3 flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <span className="text-white">로딩 중...</span>
        </div>
      </motion.div>
    )
  }

  if (!user) {
    return <AuthModal />
  }

  const addTodo = async () => {
    if (newTodo.trim() === "" || isAdding) return
    
    setIsAdding(true)
    setError(null)
    
    try {
      await todoService.addTodo(newTodo.trim())
      setNewTodo("")
    } catch (error) {
      console.error('Failed to add todo:', error)
      setError('할일을 추가하는데 실패했습니다.')
    } finally {
      setIsAdding(false)
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      await todoService.toggleTodo(id, !todo.completed)
    } catch (error) {
      console.error('Failed to toggle todo:', error)
      setError('할일 상태를 변경하는데 실패했습니다.')
    }
  }

  const removeTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id)
    } catch (error) {
      console.error('Failed to delete todo:', error)
      setError('할일을 삭제하는데 실패했습니다.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return 0
    return a.completed ? 1 : -1
  })

  const completedTodos = todos.filter((todo) => todo.completed).length
  const remainingTodos = todos.length - completedTodos

  return (
    <motion.div
      className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 mong-todo"
      initial={false}
      animate={{
        width: isExpanded ? "var(--di-expanded-width)" : "var(--di-collapsed-width)",
        height: isExpanded ? "auto" : "var(--di-collapsed-height)",
        borderRadius: isExpanded ? "var(--di-expanded-radius)" : "var(--di-border-radius)",
      }}
      transition={{
        ...snappyTransition,
        borderRadius: { duration: 0.08 },
      }}
    >
      <motion.div
        className="bg-black text-white h-full cursor-pointer overflow-hidden rounded-[inherit] border border-gray-800"
        onClick={() => !isExpanded && setIsExpanded(true)}
        layout
        transition={snappyTransition}
      >
        {!isExpanded && (
          <motion.div className="p-2 flex items-center justify-between h-full" layout>
            <div className="flex items-center space-x-2">
              <MongLogo size={18} />
              <span className="font-semibold">Mong</span>
            </div>
            <div className="flex items-center space-x-2 h-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
              ) : (
                <>
                  {remainingTodos > 0 && (
                    <span className="bg-yellow-500 text-black rounded-full w-6 h-6 min-w-[24px] flex items-center justify-center text-xs font-medium">
                      {remainingTodos}
                    </span>
                  )}
                  {completedTodos > 0 && (
                    <span className="bg-gray-500 text-white rounded-full w-6 h-6 min-w-[24px] flex items-center justify-center text-xs font-medium">
                      {completedTodos}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowProfile(!showProfile)
                    }}
                    className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-3 w-3 text-white" />
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                ...snappyTransition,
                opacity: { duration: 0.1 },
              }}
              className="p-4 pb-2"
            >
              <div className="flex mb-4 items-center">
                <div className="flex-grow relative mr-2">
                  <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new todo"
                    className="w-full bg-[#111111] border-[#222222] text-gray-200 placeholder:text-gray-500 focus:border-[#333333] focus:outline-none focus:ring-0 focus:ring-offset-0 h-10 pl-10 transition-colors duration-200 rounded-lg"
                    ref={inputRef}
                    aria-label="New todo input"
                    disabled={isAdding}
                  />
                  <Pencil className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                <Button
                  onClick={addTodo}
                  disabled={isAdding || newTodo.trim() === ""}
                  className="bg-[#111111] hover:bg-[#222222] text-gray-400 hover:text-gray-200 transition-colors h-10 px-3 border border-[#222222] rounded-lg disabled:opacity-50"
                >
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </Button>
              </div>
              
              {error && (
                <div className="mb-2 p-2 bg-red-900/50 border border-red-800 rounded-lg text-red-200 text-sm">
                  {error}
                  <Button
                    onClick={() => setError(null)}
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0 h-auto text-red-200 hover:text-red-100"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
              <motion.ul className="space-y-2 max-h-60 overflow-y-auto" role="list" aria-label="Todo list" layout>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                    <span className="ml-2 text-gray-400">할일을 불러오는 중...</span>
                  </div>
                ) : todos.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    할일이 없습니다. 새로운 할일을 추가해보세요!
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {sortedTodos.map((todo, index) => (
                    <motion.li
                      key={todo.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={snappyTransition}
                      className="flex items-center justify-between"
                      role="listitem"
                      layout
                    >
                      <span
                        className={`flex-grow text-sm ${
                          todo.completed ? "text-gray-500 line-through decoration-gray-500" : "text-yellow-500"
                        }`}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.text}
                      </span>
                      <div className="flex items-center bg-[#111111] rounded-md border border-[#222222]">
                        <Button
                          onClick={() => toggleTodo(todo.id)}
                          size="sm"
                          variant="ghost"
                          className="h-10 px-3 text-gray-400 hover:text-gray-200 hover:bg-[#222222] rounded-none"
                          aria-label={`${todo.completed ? "Revert" : "Complete"} "${todo.text}"`}
                        >
                          {todo.completed ? <RotateCcw size={14} /> : <Check size={14} />}
                        </Button>
                        <Separator orientation="vertical" className="h-5 bg-[#222222]" />
                        <Button
                          onClick={() => removeTodo(todo.id)}
                          size="sm"
                          variant="ghost"
                          className="h-10 px-3 text-gray-400 hover:text-gray-200 hover:bg-[#222222] rounded-none"
                          aria-label={`Remove "${todo.text}" from the list`}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                  </AnimatePresence>
                )}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* 사용자 프로필 */}
      <AnimatePresence>
        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}