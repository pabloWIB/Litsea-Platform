import { createClient } from '@/lib/supabase/server'

export async function logAudit(
  adminId: string,
  action: string,
  module: string,
  recordId: string,
  details?: Record<string, unknown>,
) {
  try {
    const supabase = await createClient()
    await supabase.from('audit_logs').insert({
      admin_id:  adminId,
      action,
      module,
      record_id: recordId,
      details:   details ?? {},
    })
  } catch {
  }
}
