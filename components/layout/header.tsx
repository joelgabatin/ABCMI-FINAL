"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
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
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    name: "Ministries",
    href: "/ministries",
    children: [
      { name: "All Ministries", href: "/ministries" },
      { name: "Music Ministry", href: "/ministries/music-ministry" },
      { name: "Dance Ministry", href: "/ministries/dance-ministry" },
      { name: "Youth Ministry", href: "/ministries/youth-ministry" },
      { name: "Women's Ministry", href: "/ministries/womens-ministry" },
      { name: "Men's Ministry", href: "/ministries/mens-ministry" },
      { name: "Children's Ministry", href: "/ministries/childrens-ministry" },
      { name: "Missions & Evangelism", href: "/ministries/missions-evangelism" },
      { name: "Discipleship Group", href: "/ministries/discipleship-group" },
      { name: "Singles & Adults (SAM)", href: "/ministries/singles-adults-ministry" },
      { name: "Health Ministry", href: "/ministries/health-ministry" },
      { name: "Counseling Ministry", href: "/ministries/counseling-ministry" },
    ],
  },
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
      { name: "Testimony", href: "/testimony" },
      { name: "Feedback", href: "/feedback" },
      { name: "Missions Training", href: "/missions-training" },
    ],
  },
  { name: "Watch Us", href: "/live" },
  {
    name: "Events",
    href: "/events/upcoming",
    children: [
      { name: "Upcoming Events", href: "/events/upcoming" },
      { name: "Past Activities", href: "/events/past" },
      { name: "News & Blog", href: "/events/news" },
    ],
  },
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
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/abcmi-logo.png" 
              alt="Arise and Build For Christ Ministries" 
              width={50} 
              height={50}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <p className={cn("font-bold text-sm lg:text-base leading-tight", isScrolled ? "text-black" : "text-white")}>
                Arise and Build
              </p>
              <p className={cn("text-xs", isScrolled ? "text-black/70" : "text-white/70")}>For Christ Ministries</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn("flex items-center gap-1 px-3 py-2 rounded-md transition-colors", isScrolled ? "text-black hover:text-[var(--church-primary)]" : "text-white hover:text-[var(--church-primary)]")}>
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </button>
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
                  <Link href={item.href} className={cn("px-3 py-2 rounded-md transition-colors block", isScrolled ? "text-black hover:text-[var(--church-primary)]" : "text-white hover:text-[var(--church-primary)]")}>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login" className={cn("px-3 py-2 rounded-md transition-colors", isScrolled ? "text-black hover:text-[var(--church-primary)]" : "text-white hover:text-[var(--church-primary)]")}>
              Log In
            </Link>
            <Link href="/register" className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white px-4 py-2 rounded-md transition-colors">
              Join Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn("lg:hidden transition-colors", isScrolled ? "text-black hover:text-[var(--church-primary)]" : "text-white hover:text-[var(--church-primary)]")}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
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
                    <span className={cn("block px-4 py-2 font-medium", isScrolled ? "text-black" : "text-white")}>{item.name}</span>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn("block px-6 py-2 hover:text-[var(--church-primary)]", isScrolled ? "text-black/70" : "text-white/70")}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn("block px-4 py-2 font-medium hover:text-[var(--church-primary)]", isScrolled ? "text-black" : "text-white")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className={cn("text-center px-4 py-2 rounded-md border hover:text-[var(--church-primary)]", isScrolled ? "text-black border-black/20" : "text-white border-white/20")}>
                Log In
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white px-4 py-2 rounded-md">
                Join Us
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
