CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('therapist', 'employer', 'admin');

CREATE TYPE application_status AS ENUM (
  'new',
  'reviewing',
  'chat_enabled',
  'hired',
  'rejected'
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'therapist',
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  phone       TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.therapist_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  specialties      TEXT[] NOT NULL DEFAULT '{}',
  zones            TEXT[] NOT NULL DEFAULT '{}',
  bio              TEXT,
  experience_years INT DEFAULT 0,
  is_litsea_grad   BOOLEAN NOT NULL DEFAULT false,
  is_verified      BOOLEAN NOT NULL DEFAULT false,
  slug             TEXT UNIQUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL DEFAULT '',
  website      TEXT,
  description  TEXT,
  logo_url     TEXT,
  slug         TEXT UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vacancies (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id    UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  location       TEXT NOT NULL,
  position_type  TEXT NOT NULL DEFAULT '',
  contract_type  TEXT NOT NULL DEFAULT '',
  specialties    TEXT[] NOT NULL DEFAULT '{}',
  is_featured    BOOLEAN NOT NULL DEFAULT false,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id   UUID NOT NULL REFERENCES public.vacancies(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  status       application_status NOT NULL DEFAULT 'new',
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(vacancy_id, therapist_id)
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  issued_by    TEXT NOT NULL DEFAULT 'Litsea Centro de Capacitación',
  issued_at    DATE,
  file_url     TEXT NOT NULL,
  verified     BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE UNIQUE,
  therapist_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employer_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_active      BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  module     TEXT NOT NULL,
  record_id  TEXT,
  details    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.settings (key, value) VALUES
  ('allow_registrations', 'true'),
  ('home_title',    '"Conectamos terapeutas con el lujo"'),
  ('home_subtitle', '"Encuentra tu lugar en los mejores spas y hoteles de la Riviera Maya"')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.opiniones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  cargo       TEXT,
  empresa     TEXT,
  contenido   TEXT NOT NULL CHECK (char_length(contenido) BETWEEN 20 AND 300),
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  revisado_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  revisado_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vacancies_employer   ON public.vacancies(employer_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_active     ON public.vacancies(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy  ON public.applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_applications_therapist ON public.applications(therapist_id);
CREATE INDEX IF NOT EXISTS idx_applications_status   ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_certificates_therapist ON public.certificates(therapist_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin      ON public.audit_logs(admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_therapist_verified    ON public.therapist_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_opiniones_status      ON public.opiniones(status);
CREATE INDEX IF NOT EXISTS idx_opiniones_created     ON public.opiniones(created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_therapist_profiles_updated_at
  BEFORE UPDATE ON public.therapist_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_employer_profiles_updated_at
  BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_vacancies_updated_at
  BEFORE UPDATE ON public.vacancies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'therapist'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  IF COALESCE(NEW.raw_user_meta_data->>'role', 'therapist') = 'therapist' THEN
    INSERT INTO public.therapist_profiles (user_id)
    VALUES (NEW.id);
  END IF;

  IF NEW.raw_user_meta_data->>'role' = 'employer' THEN
    INSERT INTO public.employer_profiles (user_id, company_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', '')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
