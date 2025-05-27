'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface ParticleBackgroundProps {
  count?: number
  spread?: number
  speed?: number
  baseSize?: number
  mouseInteraction?: boolean
}

export default function ParticleBackground({
  count = 100,
  spread = 10,
  speed = 0.1,
  baseSize = 50,
  mouseInteraction = true
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let isActive = true

    const resizeCanvas = () => {
      if (!isActive || !canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initParticles = () => {
      if (!isActive || !canvas) return
      particlesRef.current = []
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * baseSize * 0.5 + 1,
          opacity: Math.random() * 0.3 + 0.1
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const animate = () => {
      if (!isActive || !canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach((particle, index) => {
        if (mouseInteraction) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            const force = (120 - distance) / 120
            particle.vx += (dx / distance) * force * 0.005
            particle.vy += (dy / distance) * force * 0.005
          }
        }

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        
        particle.vx *= 0.995
        particle.vy *= 0.995

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()

        if (index % 3 === 0) {
          particlesRef.current.slice(index + 1, index + 4).forEach(other => {
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < spread * 8) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance / (spread * 8))})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          })
        }
      })

      if (isActive) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', handleResize)
    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      isActive = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [count, spread, speed, baseSize, mouseInteraction])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}
