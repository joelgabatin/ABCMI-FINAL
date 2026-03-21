import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = profile?.role ?? 'member'
        if (role === 'admin') return NextResponse.redirect(`${origin}/admin`)
        if (role === 'pastor') return NextResponse.redirect(`${origin}/pastor`)
        return NextResponse.redirect(`${origin}/member`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
