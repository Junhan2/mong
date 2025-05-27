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
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon-16x16.svg" type="image/svg+xml" sizes="16x16" />
        <link rel="shortcut icon" href="/favicon.ico" />
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