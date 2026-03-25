import Link from "next/link"
import { SiteLayout } from "@/components/layout/site-layout"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search, Church } from "lucide-react"

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="min-h-[80vh] flex items-center justify-center bg-[var(--church-light-blue)] px-4">
        <div className="max-w-2xl mx-auto text-center">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Church className="w-16 h-16 text-[var(--church-primary)]" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[var(--church-gold)] flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">?</span>
              </div>
            </div>
          </div>

          {/* 404 */}
          <p className="text-8xl font-black text-[var(--church-primary)] leading-none mb-2">404</p>

          {/* Heading */}
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Page Not Found
          </h1>

          {/* Message */}
          <p className="text-muted-foreground text-lg mb-2 text-pretty">
            We couldn&apos;t find the page you&apos;re looking for. It may have been moved, deleted, or the link might be incorrect.
          </p>
          <p className="text-muted-foreground text-sm mb-10 italic">
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo; — Psalm 119:105
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </Link>
            <Link href="/ministries">
              <Button variant="outline" className="border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4" />
                Browse Ministries
              </Button>
            </Link>
            <Link href="javascript:history.back()">
              <Button variant="ghost" className="text-muted-foreground gap-2 w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Or visit one of these pages:</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Events", href: "/events" },
                { label: "Services", href: "/services" },
                { label: "Ministries", href: "/ministries" },
                { label: "Prayer Request", href: "/prayer-request" },
                { label: "Contact", href: "/counseling" },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-[var(--church-primary)] hover:border-[var(--church-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </SiteLayout>
  )
}
