import "@/styles/globals.css"
import "@/styles/MongTodo.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Mong",
  description: "A minimalist todo app with beautiful UI design",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/favicon.svg" color="#6366f1" />
        <Script src="https://unpkg.com/framer-motion@10.12.16/dist/framer-motion.js" strategy="async" />
      </head>
      <body className={`${inter.className} bg-gray-100`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}