import MongTodo from "@/components/MongTodo"
import ParticleBackground from "@/components/ParticleBackground"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-black">
      <ParticleBackground 
        count={100}
        spread={10}
        speed={0.1}
        baseSize={50}
        mouseInteraction={true}
      />
      <MongTodo />
    </main>
  )
}