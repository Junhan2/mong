import React from 'react'

interface MongLogoProps {
  size?: number
  className?: string
}

export default function MongLogo({ size = 24, className = "" }: MongLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mong 로고 - 간단한 원형 디자인 */}
        <circle cx="16" cy="16" r="14" fill="#fbbf24" stroke="#374151" strokeWidth="2"/>
        <circle cx="12" cy="12" r="2" fill="#1f2937"/>
        <circle cx="20" cy="12" r="2" fill="#1f2937"/>
        <path d="M10 20 Q16 24 22 20" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  )
}