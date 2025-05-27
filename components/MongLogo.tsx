import React from 'react'

interface MongLogoProps {
  size?: number
  className?: string
}

export default function MongLogo({ size = 24, className = "" }: MongLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 보라색 배경의 M 로고 */}
      <rect width="24" height="24" rx="6" fill="#6366f1"/>
      <path
        d="M6 18V8.5L10 6L14 8.5L18 6V18H16V10L14 11.5L10 11.5L8 10V18H6Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}