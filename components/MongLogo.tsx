import React from 'react'
import Image from 'next/image'

interface MongLogoProps {
  size?: number
  className?: string
}

export default function MongLogo({ size = 24, className = "" }: MongLogoProps) {
  return (
    <Image
      src="/mong-logo.png"
      alt="Mong Logo"
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      priority
    />
  )
}