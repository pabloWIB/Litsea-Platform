import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/dashboard/SettingsForm'

const DEFAULTS = {
  whatsapp_number:  '573152779642',
  whatsapp_message: 'Hola! Me gustaría consultar disponibilidad en Glamping Reserva del Ruiz.',
  contact_email:    'glampingreservadelruiz@gmail.com',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Try to load settings from DB — graceful fallback if table doesn't exist
  let settings = DEFAULTS
  let tableExists = false
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?id=eq.main&select=*`, {
      headers: {
        apikey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      cache: 'no-store',
    })
    const rows = await res.json()
    if (Array.isArray(rows) && rows[0]) {
      settings = { ...DEFAULTS, ...rows[0] }
      tableExists = true
    }
  } catch { /* table not created yet — use defaults */ }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-400 mt-0.5">Ajustes de la cuenta y del sitio web</p>
      </div>

      <SettingsForm
        userEmail={user?.email ?? ''}
        settings={settings}
        tableExists={tableExists}
      />
    </div>
  )
}
