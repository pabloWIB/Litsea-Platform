import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return redirect('/')

  const { data: cert } = await supabase.from('certificates').select('file_url').eq('id', id).single()
  if (!cert?.file_url) return redirect('/admin/certificados')

  const { data: signed } = await supabase.storage.from('certificates').createSignedUrl(cert.file_url, 3600)
  if (!signed?.signedUrl) return redirect('/admin/certificados')

  return redirect(signed.signedUrl)
}
