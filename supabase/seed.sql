-- =====================================================
-- Litsea Empleos — Datos de prueba
-- Aplicar DESPUÉS de schema.sql y rls.sql
-- SOLO en desarrollo/staging, NUNCA en producción
-- =====================================================

-- =====================================================
-- CREAR USUARIO ADMIN
-- Instrucciones:
-- 1. Crea el usuario admin en Supabase Dashboard > Auth > Users
--    Email: empleos@litseacc.edu.mx
--    Password: (el de GUIA.md)
-- 2. Copia el UUID generado
-- 3. Ejecuta el UPDATE de abajo con ese UUID
-- =====================================================

-- Actualizar rol a admin (reemplaza <UUID-ADMIN> con el UUID real)
-- UPDATE public.profiles
-- SET role = 'admin', full_name = 'Equipo Litsea'
-- WHERE email = 'empleos@litseacc.edu.mx';

-- =====================================================
-- VACANTE DE EJEMPLO (requiere un employer existente)
-- =====================================================

-- Estas inserciones funcionan solo si ya existe al menos
-- un empleador registrado. Descomentar cuando tengas datos reales.

/*
INSERT INTO public.vacancies (employer_id, title, description, location, position_type, contract_type, specialties, is_featured, is_active)
SELECT
  ep.id,
  'Terapeuta de Masajes — Grand Velas Riviera Maya',
  'Buscamos terapeuta certificado para nuestro spa de lujo en Playa del Carmen. Experiencia mínima 1 año en masajes sueco y tejido profundo. Prestaciones superiores de ley, propinas incluidas.',
  'Playa del Carmen',
  'Terapeuta',
  'Tiempo completo',
  ARRAY['Masaje Sueco', 'Tejido Profundo'],
  true,
  true
FROM public.employer_profiles ep
LIMIT 1;
*/

-- =====================================================
-- SETTINGS INICIALES (ya están en schema.sql)
-- =====================================================
-- Los settings iniciales ya se insertan en schema.sql.
-- Este archivo es solo para datos de prueba adicionales.

SELECT 'Seed ejecutado correctamente.' AS status;
