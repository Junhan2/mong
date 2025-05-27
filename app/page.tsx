import SimpleMongTodo from "@/components/SimpleMongTodo"
import SimpleParticleBackground from "@/components/SimpleParticleBackground"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black">
      <SimpleParticleBackground 
        count={50}
        mouseInteraction={true}
      />
      <SimpleMongTodo />
    </main>
  )
}
