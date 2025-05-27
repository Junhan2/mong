import SimpleMongTodo from "@/components/SimpleMongTodo"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* 간단한 배경 장식 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 고정된 파티클들 */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-white rounded-full opacity-40 animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-40 left-1/3 w-1 h-1 bg-white rounded-full opacity-35 animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-40 w-2 h-2 bg-white rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-60 right-1/4 w-1 h-1 bg-white rounded-full opacity-30 animate-ping"></div>
        <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-white rounded-full opacity-25 animate-pulse"></div>
        
        {/* 추가 파티클들 */}
        <div className="absolute top-16 left-3/4 w-1 h-1 bg-white rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-24 left-10 w-2 h-2 bg-white rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-3/4 right-20 w-1 h-1 bg-white rounded-full opacity-35 animate-pulse"></div>
        <div className="absolute bottom-10 left-2/3 w-1 h-1 bg-white rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute top-52 left-16 w-2 h-2 bg-white rounded-full opacity-40 animate-ping"></div>
      </div>
      
      <SimpleMongTodo />
    </main>
  )
}
