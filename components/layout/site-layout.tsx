"use client"

import { Header } from "./header"
import { Footer } from "./footer"
import { ScrollToTopButton } from "./scroll-buttons"
import ChurchChatbot from "@/components/chatbot/church-chatbot"

interface SiteLayoutProps {
  children: React.ReactNode
  showChatbot?: boolean
}

export function SiteLayout({
  children,
  showChatbot = true,
}: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
      {showChatbot && <ChurchChatbot />}
    </div>
  )
}
