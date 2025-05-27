'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
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
              <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {todos.length}
              </span>
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
