import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const userId = data.user.id

      // Use service role to bypass RLS and reliably fetch the role
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: profile } = await admin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      const role = profile?.role ?? 'member'
      if (role === 'super_admin' || role === 'admin') {
        return NextResponse.redirect(`${origin}/super_admin`)
      }
      if (role === 'pastor') {
        return NextResponse.redirect(`${origin}/pastor`)
      }
      return NextResponse.redirect(`${origin}/member`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
