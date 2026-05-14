CREATE TABLE IF NOT EXISTS public.opiniones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  cargo       TEXT,
  empresa     TEXT,
  contenido   TEXT NOT NULL CHECK (char_length(contenido) BETWEEN 20 AND 300),
  rating      INT  CHECK (rating BETWEEN 1 AND 5),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  revisado_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  revisado_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opiniones_status  ON public.opiniones(status);
CREATE INDEX IF NOT EXISTS idx_opiniones_created ON public.opiniones(created_at DESC);

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
