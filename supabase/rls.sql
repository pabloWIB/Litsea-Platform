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

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "profiles: lectura pública"
  ON public.profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "profiles: editar propio"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles: admin acceso total"
  ON public.profiles FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "therapist_profiles: lectura pública verificados"
  ON public.therapist_profiles FOR SELECT
  USING (is_verified = true);

CREATE POLICY "therapist_profiles: propietario"
  ON public.therapist_profiles FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "therapist_profiles: admin"
  ON public.therapist_profiles FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "employer_profiles: lectura pública"
  ON public.employer_profiles FOR SELECT
  USING (true);

CREATE POLICY "employer_profiles: propietario"
  ON public.employer_profiles FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "employer_profiles: admin"
  ON public.employer_profiles FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "vacancies: lectura pública activas"
  ON public.vacancies FOR SELECT
  USING (is_active = true);

CREATE POLICY "vacancies: empleador propietario"
  ON public.vacancies FOR ALL
  USING (
    employer_id IN (
      SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "vacancies: admin"
  ON public.vacancies FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "applications: terapeuta propietario"
  ON public.applications FOR ALL
  USING (
    therapist_id IN (
      SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "applications: empleador ve sus vacantes"
  ON public.applications FOR SELECT
  USING (
    vacancy_id IN (
      SELECT v.id FROM public.vacancies v
      JOIN public.employer_profiles ep ON ep.id = v.employer_id
      WHERE ep.user_id = auth.uid()
    )
  );

CREATE POLICY "applications: admin"
  ON public.applications FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "certificates: propietario"
  ON public.certificates FOR ALL
  USING (
    therapist_id IN (
      SELECT id FROM public.therapist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "certificates: admin"
  ON public.certificates FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "conversations: participantes"
  ON public.conversations FOR SELECT
  USING (
    therapist_id = auth.uid()
    OR employer_id = auth.uid()
    OR public.current_user_role() = 'admin'
  );

CREATE POLICY "conversations: admin activa"
  ON public.conversations FOR UPDATE
  USING (public.current_user_role() = 'admin');

CREATE POLICY "conversations: admin crea"
  ON public.conversations FOR INSERT
  WITH CHECK (public.current_user_role() = 'admin');

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

CREATE POLICY "audit_logs: solo admin"
  ON public.audit_logs FOR ALL
  USING (public.current_user_role() = 'admin');

CREATE POLICY "settings: lectura pública"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "settings: solo admin modifica"
  ON public.settings FOR ALL
  USING (public.current_user_role() = 'admin');

ALTER TABLE public.opiniones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opiniones: lectura pública aprobadas"
  ON public.opiniones FOR SELECT
  USING (status = 'approved');

CREATE POLICY "opiniones: inserción pública"
  ON public.opiniones FOR INSERT
  WITH CHECK (true);

CREATE POLICY "opiniones: admin acceso total"
  ON public.opiniones FOR ALL
  USING (public.current_user_role() = 'admin');
