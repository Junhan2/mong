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
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  // 초기 데이터 로드
  useEffect(() => {
    if (user && !authLoading) {
      loadTodos()
    } else if (!authLoading) {
      setIsLoading(false)
    }
  }, [user, authLoading])

  // Realtime 구독 설정
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime update:', payload)
          handleRealtimeUpdate(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // 확장 시 입력 필드에 포커스
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isExpanded])

  // 편집 시 입력 필드에 포커스
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  const loadTodos = async () => {
    try {
      setIsLoading(true)
      const data = await todoService.getTodos()
      setTodos(data)
      setError(null)
    } catch (error: any) {
      console.error('Error loading todos:', error)
      setError('할일을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    
    switch (eventType) {
      case 'INSERT':
        setTodos(prev => [newRecord, ...prev])
        break
      case 'UPDATE':
        setTodos(prev => prev.map(todo => 
          todo.id === newRecord.id ? newRecord : todo
        ))
        break
      case 'DELETE':
        setTodos(prev => prev.filter(todo => todo.id !== oldRecord.id))
        break
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim() || isAdding) return

    try {
      setIsAdding(true)
      setError(null)
      
      const todo = await todoService.addTodo(newTodo.trim())
      setNewTodo("")
      
      // Realtime으로 업데이트되므로 수동으로 추가하지 않음
    } catch (error: any) {
      console.error('Error adding todo:', error)
      setError('할일 추가에 실패했습니다.')
    } finally {
      setIsAdding(false)
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      await todoService.toggleTodo(id, completed)
      // Realtime으로 업데이트됨
    } catch (error: any) {
      console.error('Error toggling todo:', error)
      setError('할일 상태 변경에 실패했습니다.')
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id)
      // Realtime으로 업데이트됨
    } catch (error: any) {
      console.error('Error deleting todo:', error)
      setError('할일 삭제에 실패했습니다.')
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = async () => {
    if (!editText.trim() || !editingId) return

    try {
      await todoService.updateTodo(editingId, editText.trim())
      setEditingId(null)
      setEditText("")
      // Realtime으로 업데이트됨
    } catch (error: any) {
      console.error('Error updating todo:', error)
      setError('할일 수정에 실패했습니다.')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const pendingCount = todos.filter(todo => !todo.completed).length
  const totalCount = todos.length

  // 인증 로딩 중
  if (authLoading) {
    return (
      <motion.div
        className="flex items-center justify-center w-16 h-8 bg-black rounded-full border border-gray-800"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      </motion.div>
    )
  }

  // 미인증 상태
  if (!user) {
    return <AuthModal />
  }

  return (
    <>
      <motion.div
        className="relative bg-black border border-gray-800 rounded-2xl overflow-hidden"
        layout
        transition={snappyTransition}
        animate={{
          width: isExpanded ? "600px" : "200px",
          height: isExpanded ? "500px" : "50px",
        }}
      >
        {/* 컴팩트 상태 */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between h-full px-4 cursor-pointer"
              onClick={() => setIsExpanded(true)}
            >
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-white">
                  Mong
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {pendingCount > 0 && (
                  <motion.div
                    className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={snappyTransition}
                  >
                    {pendingCount}
                  </motion.div>
                )}
                {completedCount > 0 && (
                  <motion.div
                    className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={snappyTransition}
                  >
                    {completedCount}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 확장 상태 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-6 h-full flex flex-col"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-white">Mong</h1>
                  <div className="flex items-center space-x-2">
                    {pendingCount > 0 && (
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        {pendingCount}
                      </span>
                    )}
                    {completedCount > 0 && (
                      <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {completedCount}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfile(true)}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <UserIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 에러 표시 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm mb-4"
                >
                  {error}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="ml-2 p-0 h-auto text-red-400 hover:text-red-300"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}

              {/* 할일 추가 */}
              <div className="flex space-x-2 mb-6">
                <Input
                  ref={inputRef}
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="새 할일을 입력하세요..."
                  className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={isAdding}
                />
                <Button
                  onClick={addTodo}
                  disabled={!newTodo.trim() || isAdding}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Separator className="bg-gray-800 mb-4" />

              {/* 할일 목록 */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  </div>
                ) : todos.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    아직 할일이 없습니다
                  </div>
                ) : (
                  <AnimatePresence>
                    {/* 미완료 할일들 먼저 표시 */}
                    {todos
                      .filter(todo => !todo.completed)
                      .map((todo) => (
                        <motion.div
                          key={todo.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={snappyTransition}
                          className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg border border-gray-800"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTodo(todo.id, true)}
                            className="p-0 w-5 h-5 rounded-full border-2 border-gray-600 hover:border-yellow-500 transition-colors"
                          />
                          
                          {editingId === todo.id ? (
                            <div className="flex-1 flex items-center space-x-2">
                              <Input
                                ref={editInputRef}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyPress={handleEditKeyPress}
                                className="flex-1 bg-gray-800 border-gray-700 text-white text-sm"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={saveEdit}
                                className="p-1 text-green-400 hover:text-green-300"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEdit}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>  
                              <span className="flex-1 text-white text-sm">
                                {todo.text}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(todo)}
                                  className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTodo(todo.id)}
                                  className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    
                    {/* 완료된 할일들 */}
                    {todos
                      .filter(todo => todo.completed)
                      .map((todo) => (
                        <motion.div
                          key={todo.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={snappyTransition}
                          className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800/50 group"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTodo(todo.id, false)}
                            className="p-0 w-5 h-5 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </Button>
                          
                          <span className="flex-1 text-gray-500 text-sm line-through">
                            {todo.text}
                          </span>
                          
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTodo(todo.id, false)}
                              className="p-1 text-gray-500 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTodo(todo.id)}
                              className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 사용자 프로필 모달 */}
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </>
  )
}