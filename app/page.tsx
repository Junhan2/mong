import MongTodo from "@/components/MongTodo"
import ParticleBackground from "@/components/ParticleBackground"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black">
      <ParticleBackground 
        count={80}
        spread={12}
        speed={0.15}
        baseSize={3}
        mouseInteraction={true}
      />
      <MongTodo />
    </main>
  )
}