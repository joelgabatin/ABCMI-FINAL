"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Pastoral Team", href: "/pastoral-team" },
  { name: "Ministries", href: "/ministries" },
  { name: "Service Schedules", href: "/services" },
  { name: "Events", href: "/events" },
  { name: "Donate", href: "/donate" },
]

const connectLinks = [
  { name: "Prayer Request", href: "/prayer-request" },
  { name: "Counseling", href: "/counseling" },
  { name: "Testimony", href: "/testimony" },
  { name: "Bible Study", href: "/bible-study" },
  { name: "Bible Reading", href: "/bible-reading" },
  { name: "Daily Devotional", href: "/devotional" },
  { name: "Feedback", href: "/feedback" },
]

interface SiteContact {
  address: string
  contact_phone: string
  contact_email: string
  facebook_url: string
  youtube_url: string
  instagram_url: string
  tiktok_url: string
}

const DEFAULTS: SiteContact = {
  address: "East Quirino Hill, Baguio City, Philippines",
  contact_phone: "+63 74 123 4567",
  contact_email: "info@abcmi.org",
  facebook_url: "",
  youtube_url: "",
  instagram_url: "",
  tiktok_url: "",
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.101 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  )
}

function TiktokIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

export function Footer() {
  const [contact, setContact] = useState<SiteContact>(DEFAULTS)

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setContact({
            address:       data.address       ?? DEFAULTS.address,
            contact_phone: data.contact_phone ?? DEFAULTS.contact_phone,
            contact_email: data.contact_email ?? DEFAULTS.contact_email,
            facebook_url:  data.facebook_url  ?? "",
            youtube_url:   data.youtube_url   ?? "",
            instagram_url: data.instagram_url ?? "",
            tiktok_url:    data.tiktok_url    ?? "",
          })
        }
      })
      .catch(() => {})
  }, [])

  const socialLinks = [
    { url: contact.facebook_url,  label: "Facebook",  Icon: FacebookIcon  },
    { url: contact.youtube_url,   label: "YouTube",   Icon: YoutubeIcon   },
    { url: contact.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { url: contact.tiktok_url,    label: "TikTok",    Icon: TiktokIcon    },
  ].filter(s => s.url)

  return (
    <footer className="bg-[var(--church-dark-text)] text-white">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--church-primary)] flex items-center justify-center">
                <span className="text-white font-bold">AB</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Arise and Build</h3>
                <p className="text-sm text-gray-400">For Christ Ministries Inc.</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A faith-centered community dedicated to spreading the Gospel, nurturing believers, and building disciples for Christ.
            </p>
            {/* Social media icons — dynamic */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map(({ url, label, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--church-primary)] transition-colors"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
                <a
                  href={`mailto:${contact.contact_email}`}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--church-primary)] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-[var(--church-primary)] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-[var(--church-primary)] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — dynamic */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 shrink-0 text-[var(--church-primary)]" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 shrink-0 text-[var(--church-primary)]" />
                <span>{contact.contact_phone}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 shrink-0 text-[var(--church-primary)]" />
                <span>{contact.contact_email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Arise and Build For Christ Ministries Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-[var(--church-primary)]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--church-primary)]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
