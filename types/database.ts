// =====================================================
// Litsea Empleos — Database Types
// Refleja exactamente supabase/schema.sql
// =====================================================

// ------ Enums ----------------------------------------

export type UserRole = 'therapist' | 'employer' | 'admin'

export type ApplicationStatus =
  | 'new'
  | 'reviewing'
  | 'chat_enabled'
  | 'hired'
  | 'rejected'

// ------ Raw table rows (1:1 con columnas de DB) ------

export interface ProfileRow {
  id: string
  role: UserRole
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TherapistProfileRow {
  id: string
  user_id: string
  specialties: string[]
  zones: string[]
  bio: string | null
  experience_years: number
  is_litsea_grad: boolean
  is_verified: boolean
  slug: string | null
  created_at: string
  updated_at: string
}

export interface EmployerProfileRow {
  id: string
  user_id: string
  company_name: string
  website: string | null
  description: string | null
  logo_url: string | null
  slug: string | null
  created_at: string
  updated_at: string
}

export interface VacancyRow {
  id: string
  employer_id: string
  title: string
  description: string
  location: string
  position_type: string
  contract_type: string
  specialties: string[]
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ApplicationRow {
  id: string
  vacancy_id: string
  therapist_id: string
  status: ApplicationStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CertificateRow {
  id: string
  therapist_id: string
  title: string
  issued_by: string
  issued_at: string | null
  file_url: string
  verified: boolean
  created_at: string
}

export interface ConversationRow {
  id: string
  application_id: string
  therapist_id: string
  employer_id: string
  is_active: boolean
  created_at: string
}

export interface MessageRow {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  read_at: string | null
  created_at: string
}

export interface AuditLogRow {
  id: string
  admin_id: string
  action: string
  module: string
  record_id: string | null
  details: Record<string, unknown> | null
  created_at: string
}

export interface SettingRow {
  key: string
  value: unknown
  updated_by: string | null
  updated_at: string
}

// ------ Insert types (omit server-generated fields) --

export type ProfileInsert = Omit<ProfileRow, 'created_at' | 'updated_at'>

export type TherapistProfileInsert = Omit<
  TherapistProfileRow,
  'id' | 'created_at' | 'updated_at'
>

export type EmployerProfileInsert = Omit<
  EmployerProfileRow,
  'id' | 'created_at' | 'updated_at'
>

export type VacancyInsert = Omit<VacancyRow, 'id' | 'created_at' | 'updated_at'>

export type ApplicationInsert = Omit<ApplicationRow, 'id' | 'created_at' | 'updated_at'>

export type CertificateInsert = Omit<CertificateRow, 'id' | 'created_at'>

export type ConversationInsert = Omit<ConversationRow, 'id' | 'created_at'>

export type MessageInsert = Omit<MessageRow, 'id' | 'created_at'>

export type AuditLogInsert = Omit<AuditLogRow, 'id' | 'created_at'>

export type SettingUpsert = Pick<SettingRow, 'key' | 'value' | 'updated_by'>

// ------ Update types (todo opcional) -----------------

export type ProfileUpdate = Partial<
  Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>
>

export type TherapistProfileUpdate = Partial<
  Omit<TherapistProfileRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

export type EmployerProfileUpdate = Partial<
  Omit<EmployerProfileRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

export type VacancyUpdate = Partial<
  Omit<VacancyRow, 'id' | 'employer_id' | 'created_at' | 'updated_at'>
>

export type ApplicationUpdate = Partial<
  Omit<ApplicationRow, 'id' | 'vacancy_id' | 'therapist_id' | 'created_at' | 'updated_at'>
>

// ------ Tipos enriquecidos (joins frecuentes) ---------

/** Terapeuta con su perfil de usuario */
export interface Therapist extends TherapistProfileRow {
  profile: ProfileRow
}

/** Empleador con su perfil de usuario */
export interface Employer extends EmployerProfileRow {
  profile: ProfileRow
}

/** Vacante con info del empleador */
export interface VacancyWithEmployer extends VacancyRow {
  employer: EmployerProfileRow & { profile: Pick<ProfileRow, 'full_name' | 'email'> }
}

/** Aplicación con vacante y terapeuta */
export interface ApplicationWithDetails extends ApplicationRow {
  vacancy: Pick<VacancyRow, 'title' | 'location' | 'position_type' | 'contract_type'>
  therapist: TherapistProfileRow & { profile: Pick<ProfileRow, 'full_name' | 'avatar_url' | 'email'> }
}

/** Conversación con participantes */
export interface ConversationWithParticipants extends ConversationRow {
  therapist_profile: Pick<ProfileRow, 'full_name' | 'avatar_url'>
  employer_profile: Pick<ProfileRow, 'full_name'> & { company_name?: string }
  last_message?: Pick<MessageRow, 'body' | 'created_at' | 'sender_id'>
  unread_count?: number
}

/** Mensaje con info del remitente */
export interface MessageWithSender extends MessageRow {
  sender: Pick<ProfileRow, 'full_name' | 'avatar_url' | 'role'>
}

/** Certificado con info del terapeuta (para panel admin) */
export interface CertificateWithTherapist extends CertificateRow {
  therapist: TherapistProfileRow & { profile: Pick<ProfileRow, 'full_name' | 'email'> }
}

/** Audit log con info del admin */
export interface AuditLogWithAdmin extends AuditLogRow {
  admin: Pick<ProfileRow, 'full_name' | 'email'>
}

// ------ Supabase Database interface ------------------
// Formato compatible con el cliente de Supabase para tipado de .from()

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      therapist_profiles: {
        Row: TherapistProfileRow
        Insert: TherapistProfileInsert
        Update: TherapistProfileUpdate
      }
      employer_profiles: {
        Row: EmployerProfileRow
        Insert: EmployerProfileInsert
        Update: EmployerProfileUpdate
      }
      vacancies: {
        Row: VacancyRow
        Insert: VacancyInsert
        Update: VacancyUpdate
      }
      applications: {
        Row: ApplicationRow
        Insert: ApplicationInsert
        Update: ApplicationUpdate
      }
      certificates: {
        Row: CertificateRow
        Insert: CertificateInsert
        Update: Partial<CertificateInsert>
      }
      conversations: {
        Row: ConversationRow
        Insert: ConversationInsert
        Update: Partial<ConversationInsert>
      }
      messages: {
        Row: MessageRow
        Insert: MessageInsert
        Update: Partial<MessageInsert>
      }
      audit_logs: {
        Row: AuditLogRow
        Insert: AuditLogInsert
        Update: never
      }
      settings: {
        Row: SettingRow
        Insert: SettingUpsert
        Update: Partial<SettingUpsert>
      }
    }
    Enums: {
      user_role: UserRole
      application_status: ApplicationStatus
    }
  }
}

// ------ Labels para UI --------------------------------

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  new:          'Nueva',
  reviewing:    'En revisión',
  chat_enabled: 'Chat habilitado',
  hired:        'Contratado',
  rejected:     'Rechazada',
}

export const APPLICATION_STATUS_COLOR: Record<ApplicationStatus, string> = {
  new:          'bg-white/8 text-white/60 border-white/15',
  reviewing:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  chat_enabled: 'bg-[#2FB7A3]/10 text-[#2FB7A3] border-[#2FB7A3]/20',
  hired:        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected:     'bg-red-500/10 text-red-400 border-red-500/20',
}

export const SPECIALTIES = [
  'Masaje Sueco',
  'Tejido Profundo',
  'Masaje Deportivo',
  'Reflexología',
  'Tratamientos Faciales',
  'Aromaterapia',
  'Piedras Calientes',
  'Drenaje Linfático',
  'Terapias Ayurvédicas',
  'Hidroterapia',
  'Envolturas Corporales',
  'Exfoliaciones',
] as const

export type Specialty = typeof SPECIALTIES[number]

export const ZONES = [
  'Cancún',
  'Playa del Carmen',
  'Tulum',
  'Cozumel',
  'Puerto Morelos',
  'Akumal',
  'Bacalar',
  'Riviera Maya (general)',
] as const

export type Zone = typeof ZONES[number]

export const CONTRACT_TYPES = [
  'Tiempo completo',
  'Tiempo parcial',
  'Por temporada',
  'Por proyecto',
  'Freelance',
] as const

export const POSITION_TYPES = [
  'Terapeuta',
  'Esteticista',
  'Masajista',
  'Instructor de bienestar',
  'Coordinador de spa',
  'Recepcionista de spa',
] as const
