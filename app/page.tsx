export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black">
      <div className="bg-black border border-gray-800 rounded-2xl p-6 text-white">
        <h1 className="text-xl mb-4">Mong Todo</h1>
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="할일을 입력하세요"
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
          />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded font-medium">
            추가
          </button>
        </div>
        <div className="mt-4 text-gray-400">
          간단한 테스트 버전
        </div>
      </div>
    </main>
  )
}
