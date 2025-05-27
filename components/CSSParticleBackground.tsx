'use client'

import { useEffect, useState } from 'react'

interface CSSParticle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function CSSParticleBackground({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<CSSParticle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // 파티클 생성
    const newParticles: CSSParticle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        size: Math.random() * 4 + 2, // 2-6px
        duration: Math.random() * 20 + 10, // 10-30초
        delay: Math.random() * 5 // 0-5초
      })
    }
    setParticles(newParticles)

    // 마우스 이벤트
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [count])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-30 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s, 
                       pulse 2s ease-in-out infinite`,
            transform: `translate(${(mousePos.x - 50) * 0.1}px, ${(mousePos.y - 50) * 0.1}px)`
          }}
        />
      ))}
      
      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
          }
          50% { 
            transform: translateY(-10px) translateX(-10px); 
          }
          75% { 
            transform: translateY(-30px) translateX(5px); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.2; 
          }
          50% { 
            opacity: 0.5; 
          }
        }
      `}</style>
    </div>
  )
}
