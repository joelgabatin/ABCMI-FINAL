import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HandCoins, Smartphone, Building2, Shield, Heart, Copy, CheckCircle } from "lucide-react"

export default function DonatePage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section
        className="pt-24 pb-12 lg:pt-32 lg:pb-16 relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490139753981-d33e0da2c26c?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <HandCoins className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Give to the Ministry</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {'"'}Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.{'"'}
            </p>
            <p className="text-[var(--church-gold)] font-semibold mt-2">2 Corinthians 9:7</p>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">How to Give</h2>
              <p className="text-muted-foreground mt-2">
                Choose the method that works best for you. All donations go to one official church account.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* GCash */}
              <Card className="bg-background border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">GCash</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-[var(--church-soft-gray)] rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">GCash Number</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-foreground">0917 123 4567</p>
                      <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-[var(--church-primary)]">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--church-soft-gray)] rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                    <p className="font-semibold text-foreground">Arise and Build For Christ Ministries</p>
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">Scan QR Code</p>
                    <div className="w-32 h-32 mx-auto mt-2 bg-[var(--church-soft-gray)] rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                      <span className="text-xs text-muted-foreground">QR Code</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Transfer */}
              <Card className="bg-background border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--church-gold)] flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Bank Transfer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-[var(--church-soft-gray)] rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Bank</p>
                    <p className="font-semibold text-foreground">Bank of the Philippine Islands (BPI)</p>
                  </div>
                  <div className="p-4 bg-[var(--church-soft-gray)] rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-foreground">1234-5678-90</p>
                      <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-[var(--church-primary)]">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--church-soft-gray)] rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                    <p className="font-semibold text-foreground">Arise and Build For Christ Ministries Inc.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Notice */}
            <Card className="mt-8 bg-emerald-50 border-emerald-200">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Secure & Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    All donations are received through our official church accounts. Your giving goes directly to support 
                    our ministries, missions, and community programs. We are committed to good stewardship and transparency 
                    in the use of all funds entrusted to us.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* No Online Access */}
            <Card className="mt-6 bg-background border border-border">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">Don{`'`}t Have Online Payment Access?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  You can give your tithes and offerings during our Sunday worship services or contact our church office 
                  for other arrangements. We{`'`}ll be happy to assist you.
                </p>
                <Link href="/counseling">
                  <Button variant="outline" className="border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white">
                    Contact Church Office
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Give Section */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Your Giving Makes a Difference</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="border border-border">
                <CardContent className="p-6 text-center">
                  <Heart className="w-10 h-10 text-[var(--church-primary)] mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Local Ministry</h3>
                  <p className="text-sm text-muted-foreground">
                    Support our worship services, children{`'`}s programs, and community outreach.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-6 text-center">
                  <svg className="w-10 h-10 text-[var(--church-gold)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-foreground mb-2">Missions</h3>
                  <p className="text-sm text-muted-foreground">
                    Help us plant churches and spread the Gospel locally and internationally.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-6 text-center">
                  <svg className="w-10 h-10 text-emerald-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="font-semibold text-foreground mb-2">Community Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide assistance to families in need and support community development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
