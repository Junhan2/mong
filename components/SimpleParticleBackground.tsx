'use client'

import { useEffect, useRef } from 'react'

interface SimpleParticleBackgroundProps {
  count?: number
  mouseInteraction?: boolean
}

export default function SimpleParticleBackground({
  count = 50,
  mouseInteraction = true
}: SimpleParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let isActive = true

    // Canvas 크기 설정
    const resizeCanvas = () => {
      if (!canvas || !isActive) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // 파티클 초기화
    const initParticles = () => {
      if (!canvas || !isActive) return
      particlesRef.current = []
      
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        })
      }
    }

    // 마우스 이벤트
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    // 애니메이션 루프
    const animate = () => {
      if (!isActive || !canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach((particle) => {
        // 마우스 인터랙션
        if (mouseInteraction) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            const force = (100 - distance) / 1000
            particle.vx += dx * force
            particle.vy += dy * force
          }
        }

        // 파티클 이동
        particle.x += particle.vx
        particle.y += particle.vy

        // 경계 처리
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8

        // 속도 감쇠
        particle.vx *= 0.99
        particle.vy *= 0.99

        // 파티클 그리기
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()
      })

      if (isActive) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // 초기화
    resizeCanvas()
    initParticles()
    animate()

    // 이벤트 리스너
    window.addEventListener('resize', () => {
      resizeCanvas()
      initParticles()
    })

    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // 클린업
    return () => {
      isActive = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [count, mouseInteraction])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: -1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    />
  )
}
