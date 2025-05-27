import SimpleMongTodo from "@/components/SimpleMongTodo"
import CSSParticleBackground from "@/components/CSSParticleBackground"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black">
      <CSSParticleBackground count={30} />
      <SimpleMongTodo />
    </main>
  )
}
