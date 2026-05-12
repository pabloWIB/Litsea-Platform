-- =====================================================
-- Litsea Empleos — Row Level Security
-- Aplicar DESPUÉS de schema.sql
-- =====================================================

-- =====================================================
-- HABILITAR RLS
-- =====================================================

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings           ENABLE ROW LEVEL SECURITY;

-- Helper: rol del usuario actual
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- POLÍTICAS: profiles
-- =====================================================

-- Cualquiera puede leer perfiles públicos activos
CREATE POLICY "profiles: lectura pública"
  ON public.profiles FOR SELECT
  USING (is_active = true);

-- Usuario solo edita su propio perfil
CREATE POLICY "profiles: editar propio"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- Admin lee y edita todos
CREATE POLICY "profiles: admin acceso total"
  ON public.profiles FOR ALL
  USING (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: therapist_profiles
-- =====================================================

-- Lectura pública de terapeutas verificados
CREATE POLICY "therapist_profiles: lectura pública verificados"
  ON public.therapist_profiles FOR SELECT
  USING (is_verified = true);

-- Terapeuta lee y edita su propio perfil
CREATE POLICY "therapist_profiles: propietario"
  ON public.therapist_profiles FOR ALL
  USING (user_id = auth.uid());

-- Admin acceso total
CREATE POLICY "therapist_profiles: admin"
  ON public.therapist_profiles FOR ALL
  USING (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: employer_profiles
-- =====================================================

-- Lectura pública de empleadores
CREATE POLICY "employer_profiles: lectura pública"
  ON public.employer_profiles FOR SELECT
  USING (true);

-- Empleador edita su propio perfil
CREATE POLICY "employer_profiles: propietario"
  ON public.employer_profiles FOR ALL
  USING (user_id = auth.uid());

-- Admin acceso total
CREATE POLICY "employer_profiles: admin"
  ON public.employer_profiles FOR ALL
  USING (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: vacancies
-- =====================================================

-- Lectura pública de vacantes activas
CREATE POLICY "vacancies: lectura pública activas"
  ON public.vacancies FOR SELECT
  USING (is_active = true);

-- Empleador crea y edita sus propias vacantes
CREATE POLICY "vacancies: empleador propietario"
  ON public.vacancies FOR ALL
  USING (
    employer_id IN (
      SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
    )
  );

-- Admin acceso total
CREATE POLICY "vacancies: admin"
  ON public.vacancies FOR ALL
  USING (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: applications
-- =====================================================

-- Terapeuta ve sus propias aplicaciones
CREATE POLICY "applications: terapeuta propietario"
  ON public.applications FOR ALL
  USING (
    therapist_id IN (
      SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()
    )
  );

-- Empleador ve aplicaciones a sus vacantes
CREATE POLICY "applications: empleador ve sus vacantes"
  ON public.applications FOR SELECT
  USING (
    vacancy_id IN (
      SELECT v.id FROM public.vacancies v
      JOIN public.employer_profiles ep ON ep.id = v.employer_id
      WHERE ep.user_id = auth.uid()
    )
  );

-- Admin acceso total
CREATE POLICY "applications: admin"
  ON public.applications FOR ALL
  USING (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: certificates
-- =====================================================

-- Propietario gestiona sus certificados
CREATE POLICY "certificates: propietario"
  ON public.certificates FOR ALL
  USING (
    therapist_id IN (
      SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()
    )
  );

-- Admin acceso total (para verificar)
CREATE POLICY "certificates: admin"
  ON public.certificates FOR ALL
  USING (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: conversations
-- =====================================================

-- Solo participantes y admin
CREATE POLICY "conversations: participantes"
  ON public.conversations FOR SELECT
  USING (
    therapist_id = auth.uid()
    OR employer_id = auth.uid()
    OR public.current_user_role() = 'admin'
  );

-- Solo admin activa conversaciones
CREATE POLICY "conversations: admin activa"
  ON public.conversations FOR UPDATE
  USING (public.current_user_role() = 'admin');

CREATE POLICY "conversations: admin crea"
  ON public.conversations FOR INSERT
  WITH CHECK (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: messages
-- =====================================================

-- Participantes leen y escriben en sus conversaciones
CREATE POLICY "messages: participantes"
  ON public.messages FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE therapist_id = auth.uid()
         OR employer_id  = auth.uid()
    )
    OR public.current_user_role() = 'admin'
  );

-- =====================================================
-- POLÍTICAS: audit_logs
-- =====================================================

-- Solo admin
CREATE POLICY "audit_logs: solo admin"
  ON public.audit_logs FOR ALL
  USING (public.current_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: settings
-- =====================================================

-- Lectura pública (home_title, home_subtitle, allow_registrations)
CREATE POLICY "settings: lectura pública"
  ON public.settings FOR SELECT
  USING (true);

-- Solo admin puede modificar
CREATE POLICY "settings: solo admin modifica"
  ON public.settings FOR ALL
  USING (public.current_user_role() = 'admin');
