"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { SiteLayout } from '@/components/layout/site-layout'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const result = await login(email, password)
    if (result.success) {
      if (result.role === 'super_admin' || result.role === 'admin') router.push('/admin')
      else router.push('/member')
    } else {
      setError(result.error || 'Login failed')
    }
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError('')
    await loginWithGoogle()
    // Redirect is handled by Supabase OAuth — page will navigate away
    setIsGoogleLoading(false)
  }

  return (
    <SiteLayout>
      <main className="min-h-screen bg-[var(--church-light-blue)] flex items-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center space-y-2 pb-4">
                <div className="mx-auto w-16 h-16 bg-[var(--church-primary)] rounded-full flex items-center justify-center mb-2">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your member account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-8">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Google Login */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-border hover:border-[var(--church-primary)] hover:bg-[var(--church-primary)]/5 transition-colors font-medium gap-3"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isLoading}
                >
                  {isGoogleLoading ? (
                    <span className="w-5 h-5 border-2 border-muted-foreground/30 border-t-[var(--church-primary)] rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider px-1">or sign in with email</span>
                  <Separator className="flex-1" />
                </div>

                {/* Email / Password form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-[var(--church-primary)] hover:text-[var(--church-primary-deep)] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white font-semibold"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 px-8 pb-8">
                <p className="text-sm text-muted-foreground text-center">
                  {"Don't have an account? "}
                  <Link
                    href="/register"
                    className="text-[var(--church-primary)] hover:text-[var(--church-primary-deep)] font-medium transition-colors"
                  >
                    Register here
                  </Link>
                </p>
              </CardFooter>
            </Card>

            {/* Demo credentials */}
            <Card className="mt-4 bg-[var(--church-gold)]/10 border-[var(--church-gold)]/40">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Admin:</span> admin@church.org / admin123</p>
                  <p><span className="font-medium text-foreground">Pastor:</span> pastor@abcmi.org / pastor123</p>
                  <p><span className="font-medium text-foreground">Member:</span> john@example.com / member123</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}
