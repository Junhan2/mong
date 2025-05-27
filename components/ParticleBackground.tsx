'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  targetOpacity: number
  pulsePhase: number
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
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const animationRef = useRef<number>()
  const isClientRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastTimeRef = useRef(0)
  const fpsRef = useRef(60)
  
  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 마우스/터치 이벤트 핸들러
  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    } else if (e.touches && e.touches.length > 0) {
      mouseRef.current.x = e.touches[0].clientX
      mouseRef.current.y = e.touches[0].clientY
    }
    mouseRef.current.isActive = true
  }, [])

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.isActive = false
  }, [])

  // 캔버스 크기 조정
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isClientRef.current) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
    
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
  }, [])

  // 파티클 초기화 (화면 크기에 따른 개수 조절)
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isClientRef.current) return

    const actualCount = isMobile ? Math.min(count * 0.5, 50) : count
    const canvasWidth = canvas.offsetWidth
    const canvasHeight = canvas.offsetHeight

    particlesRef.current = []
    for (let i = 0; i < actualCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * (isMobile ? baseSize * 0.3 : baseSize * 0.5) + 1,
        opacity: 0.1,
        targetOpacity: Math.random() * 0.3 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2
      })
    }
  }, [count, speed, baseSize, isMobile])

  useEffect(() => {
    isClientRef.current = true
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let isAnimating = true

    const animate = (currentTime: number) => {
      if (!isAnimating || !canvas) return

      // FPS 제한 (모바일에서 성능 최적화)
      const targetFPS = isMobile ? 30 : 60
      const interval = 1000 / targetFPS
      
      if (currentTime - lastTimeRef.current < interval) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      
      lastTimeRef.current = currentTime

      const canvasWidth = canvas.offsetWidth
      const canvasHeight = canvas.offsetHeight

      // 캔버스 지우기 (성능 최적화)
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      particlesRef.current.forEach((particle, index) => {
        // 마우스 인터랙션 (거리 계산 최적화)
        if (mouseInteraction && mouseRef.current.isActive) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distanceSquared = dx * dx + dy * dy
          const interactionRadius = isMobile ? 80 : 120
          
          if (distanceSquared < interactionRadius * interactionRadius) {
            const distance = Math.sqrt(distanceSquared)
            const force = (interactionRadius - distance) / interactionRadius
            const forceMultiplier = isMobile ? 0.003 : 0.005
            
            particle.vx += (dx / distance) * force * forceMultiplier
            particle.vy += (dy / distance) * force * forceMultiplier
            particle.targetOpacity = Math.min(0.8, particle.targetOpacity + force * 0.3)
          }
        }

        // 파티클 이동
        particle.x += particle.vx
        particle.y += particle.vy

        // 경계 충돌 처리 (부드러운 바운스)
        const bounce = 0.8
        if (particle.x < 0) {
          particle.x = 0
          particle.vx *= -bounce
        }
        if (particle.x > canvasWidth) {
          particle.x = canvasWidth
          particle.vx *= -bounce
        }
        if (particle.y < 0) {
          particle.y = 0
          particle.vy *= -bounce
        }
        if (particle.y > canvasHeight) {
          particle.y = canvasHeight
          particle.vy *= -bounce
        }
        
        // 마찰력 적용
        particle.vx *= 0.995
        particle.vy *= 0.995

        // 펄스 애니메이션
        particle.pulsePhase += 0.02
        const pulse = Math.sin(particle.pulsePhase) * 0.1 + 1
        
        // 투명도 부드러운 전환
        particle.opacity += (particle.targetOpacity - particle.opacity) * 0.05
        if (!mouseRef.current.isActive) {
          particle.targetOpacity += (0.2 - particle.targetOpacity) * 0.01
        }

        // 파티클 렌더링 (최적화된 그리기)
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2)
        
        // 그라디언트 효과 (성능을 위해 선택적 적용)
        if (!isMobile && particle.opacity > 0.3) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * pulse
          )
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = gradient
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        }
        
        ctx.fill()
        ctx.restore()

        // 연결선 그리기 (성능 최적화: 일부만, 모바일에서는 제한)
        if (!isMobile && index % 4 === 0) {
          const maxConnections = 2
          let connections = 0
          
          for (let j = index + 1; j < particlesRef.current.length && connections < maxConnections; j++) {
            const other = particlesRef.current[j]
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distanceSquared = dx * dx + dy * dy
            const maxDistance = spread * 6
            
            if (distanceSquared < maxDistance * maxDistance) {
              const distance = Math.sqrt(distanceSquared)
              const alpha = (1 - distance / maxDistance) * 0.1 * Math.min(particle.opacity, other.opacity)
              
              if (alpha > 0.01) {
                ctx.save()
                ctx.globalAlpha = alpha
                ctx.beginPath()
                ctx.moveTo(particle.x, particle.y)
                ctx.lineTo(other.x, other.y)
                ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
                ctx.lineWidth = 0.5
                ctx.stroke()
                ctx.restore()
                connections++
              }
            }
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    // 초기화
    resizeCanvas()
    initParticles()
    animationRef.current = requestAnimationFrame(animate)

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)
    
    if (mouseInteraction) {
      // 데스크톱
      window.addEventListener('mousemove', handlePointerMove)
      window.addEventListener('mouseleave', handlePointerLeave)
      
      // 모바일
      window.addEventListener('touchmove', handlePointerMove, { passive: true })
      window.addEventListener('touchend', handlePointerLeave)
    }

    // Cleanup
    return () => {
      isAnimating = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
      if (mouseInteraction) {
        window.removeEventListener('mousemove', handlePointerMove)
        window.removeEventListener('mouseleave', handlePointerLeave)
        window.removeEventListener('touchmove', handlePointerMove)
        window.removeEventListener('touchend', handlePointerLeave)
      }
    }
  }, [count, spread, speed, baseSize, mouseInteraction, isMobile, handlePointerMove, handlePointerLeave, resizeCanvas, initParticles])

  // 디버깅을 위해 전역에 파티클 시스템 정보 노출
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.particleSystem = {
        particles: particlesRef.current,
        isMobile,
        targetFPS: isMobile ? 30 : 60,
        canvas: canvasRef.current
      }
    }
  }, [isMobile])

  return (
    <canvas
      id="particleCanvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}