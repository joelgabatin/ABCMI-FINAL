import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { status, admin_notes, group_id } = body

  // If group_id is provided, we need to:
  // 1. Update the request status (use 'request done' if assigned a group)
  // 2. Increment the members count in the group
  // 3. Create a record in bible_study_members
  
  if (status === 'approved' && group_id) {
    // 1. Update request status to 'request done'
    const { data: requestData, error: requestError } = await supabase
      .from('bible_study_requests')
      .update({ 
        status: 'request done', 
        admin_notes, 
        group_id, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (requestError) return NextResponse.json({ error: requestError.message }, { status: 500 })

    // 2. Create a member record
    const { error: memberError } = await supabase
      .from('bible_study_members')
      .insert({
        group_id,
        request_id: id,
        name: requestData.name,
        email: requestData.email,
        phone: requestData.phone
      })

    if (memberError) {
      console.error('Failed to create member:', memberError)
    }

    // 3. Increment members count
    await supabase.rpc('increment_group_members', { group_id_param: group_id })
    
    return NextResponse.json(requestData)
  }

  const { data, error } = await supabase
    .from('bible_study_requests')
    .update({ status, admin_notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
