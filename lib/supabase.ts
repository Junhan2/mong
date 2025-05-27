import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Todo {
  id: number
  text: string
  completed: boolean
  created_at: string
  updated_at: string
  user_id: string
}

// Database operations
export const todoService = {
  // 모든 todos 가져오기 (현재 사용자만)
  async getTodos() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Todo[]
  },

  // 새 todo 추가
  async addTodo(text: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('todos')
      .insert([{ text, completed: false, user_id: user.id }])
      .select()
      .single()
    
    if (error) throw error
    return data as Todo
  },

  // todo 완료 상태 토글
  async toggleTodo(id: number, completed: boolean) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('todos')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data as Todo
  },

  // todo 삭제
  async deleteTodo(id: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) throw error
  },

  // 실시간 구독 (현재 사용자만)
  subscribeToTodos(userId: string, callback: (todos: Todo[]) => void) {
    console.log('Setting up subscription for user:', userId)
    
    return supabase
      .channel(`todos-${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'todos',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('Real-time update received:', payload)
          try {
            const todos = await this.getTodos()
            callback(todos)
          } catch (error) {
            console.error('Error fetching todos in subscription:', error)
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })
  }
}