"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    children: [
      { name: "About Us", href: "/about" },
      { name: "Pastoral Team", href: "/pastoral-team" },
    ],
  },
  { name: "Ministries", href: "/ministries" },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Service Schedules", href: "/services" },
      { name: "Daily Bible Reading", href: "/bible-reading" },
      { name: "Bible Study", href: "/bible-study" },
    ],
  },
  {
    name: "Connect",
    href: "/prayer-request",
    children: [
      { name: "Prayer Request", href: "/prayer-request" },
      { name: "Counseling", href: "/counseling" },
      { name: "Feedback & Testimony", href: "/feedback" },
    ],
  },
  { name: "Events", href: "/events" },
  { name: "Donate", href: "/donate" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[var(--church-primary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm lg:text-base">AB</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm lg:text-base text-foreground leading-tight">
                Arise and Build
              </p>
              <p className="text-xs text-muted-foreground">For Christ Ministries</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-[var(--church-primary)] hover:bg-[var(--church-light-blue)]">
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="bg-background border-border">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link href={child.href} className="cursor-pointer hover:text-[var(--church-primary)]">
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href}>
                    <Button variant="ghost" className="text-foreground hover:text-[var(--church-primary)] hover:bg-[var(--church-light-blue)]">
                      {item.name}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-[var(--church-primary)]">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                Join Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div className="space-y-1">
                    <span className="block px-4 py-2 font-medium text-foreground">{item.name}</span>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-6 py-2 text-muted-foreground hover:text-[var(--church-primary)]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 font-medium text-foreground hover:text-[var(--church-primary)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log In</Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  Join Us
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
