"use client"

import { Header } from "./header"
import { Footer } from "./footer"
import { ScrollToTopButton } from "./scroll-buttons"
import ChurchChatbot from "@/components/chatbot/church-chatbot"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
      <ChurchChatbot />
    </div>
  )
}
