-- ============================================================
-- SEED DATA — Litsea Empleos
-- ============================================================
-- IMPORTANTE: Ejecutar en este orden:
--   1. schema.sql
--   2. rls.sql
--   3. seed.sql  ← este archivo
--
-- Contraseña de todos los usuarios de prueba: Litsea2026!
-- ============================================================

-- ============================================================
-- 1. USUARIOS EN AUTH
-- El trigger handle_new_user crea automáticamente:
--   → profiles (con el rol del metadata)
--   → therapist_profiles  (si role='therapist')
--   → employer_profiles   (si role='employer')
-- ============================================================

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES

  -- Admin Litsea
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin@litseacc.edu.mx',
    crypt('Litsea2026!', gen_salt('bf')),
    NOW(),
    '{"role": "admin", "full_name": "Equipo Litsea"}'::jsonb,
    NOW(), NOW()
  ),

  -- Terapeuta 1: María García López — perfil completo, verificada
  (
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'maria.garcia@test.litsea.mx',
    crypt('Litsea2026!', gen_salt('bf')),
    NOW(),
    '{"role": "therapist", "full_name": "María García López"}'::jsonb,
    NOW(), NOW()
  ),

  -- Terapeuta 2: Carlos Ruiz Mendoza — perfil completo, verificado
  (
    'b0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'carlos.ruiz@test.litsea.mx',
    crypt('Litsea2026!', gen_salt('bf')),
    NOW(),
    '{"role": "therapist", "full_name": "Carlos Ruiz Mendoza"}'::jsonb,
    NOW(), NOW()
  ),

  -- Terapeuta 3: Ana Martínez Pérez — perfil incompleto, sin verificar
  (
    'b0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ana.martinez@test.litsea.mx',
    crypt('Litsea2026!', gen_salt('bf')),
    NOW(),
    '{"role": "therapist", "full_name": "Ana Martínez Pérez"}'::jsonb,
    NOW(), NOW()
  ),

  -- Empleador 1: Grand Hyatt Playa del Carmen
  (
    'c0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'rrhh@grandhyatt-test.litsea.mx',
    crypt('Litsea2026!', gen_salt('bf')),
    NOW(),
    '{"role": "employer", "full_name": "Grand Hyatt Playa del Carmen", "company_name": "Grand Hyatt Playa del Carmen"}'::jsonb,
    NOW(), NOW()
  ),

  -- Empleador 2: Fiesta Americana Coral Beach
  (
    'c0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'spa@fiestaameri-test.litsea.mx',
    crypt('Litsea2026!', gen_salt('bf')),
    NOW(),
    '{"role": "employer", "full_name": "Fiesta Americana Coral Beach", "company_name": "Fiesta Americana Coral Beach"}'::jsonb,
    NOW(), NOW()
  );


-- ============================================================
-- 2. COMPLETAR PERFILES DE TERAPEUTAS
-- (El trigger creó therapist_profiles con datos vacíos)
-- ============================================================

-- María García López — verificada, 5 años de experiencia
UPDATE public.therapist_profiles SET
  specialties     = ARRAY['Masoterapia Sueca', 'Reflexología', 'Masaje con Piedras Calientes'],
  zones           = ARRAY['Playa del Carmen', 'Cancún', 'Tulum'],
  bio             = 'Terapeuta certificada por Litsea Centro de Capacitación con 5 años de experiencia en spas de lujo. Especialista en masoterapia sueca y tratamientos con piedras calientes. Apasionada por el bienestar integral.',
  experience_years = 5,
  is_litsea_grad  = true,
  is_verified     = true,
  slug            = 'maria-garcia-lopez-a1b2'
WHERE user_id = 'b0000000-0000-0000-0000-000000000001';

UPDATE public.profiles SET
  phone      = '+52 984 100 0001',
  avatar_url = 'https://api.dicebear.com/9.x/avataaars/svg?seed=maria'
WHERE id = 'b0000000-0000-0000-0000-000000000001';


-- Carlos Ruiz Mendoza — verificado, 3 años de experiencia
UPDATE public.therapist_profiles SET
  specialties      = ARRAY['Aromaterapia', 'Drenaje Linfático', 'Reflexología'],
  zones            = ARRAY['Tulum', 'Playa del Carmen', 'Bacalar'],
  bio              = 'Egresado de Litsea con especialización en aromaterapia y técnicas de drenaje linfático. 3 años trabajando en hoteles boutique de la Riviera Maya.',
  experience_years = 3,
  is_litsea_grad   = true,
  is_verified      = true,
  slug             = 'carlos-ruiz-mendoza-c3d4'
WHERE user_id = 'b0000000-0000-0000-0000-000000000002';

UPDATE public.profiles SET
  phone      = '+52 984 100 0002',
  avatar_url = 'https://api.dicebear.com/9.x/avataaars/svg?seed=carlos'
WHERE id = 'b0000000-0000-0000-0000-000000000002';


-- Ana Martínez Pérez — sin verificar, perfil incompleto (solo especialidad)
UPDATE public.therapist_profiles SET
  specialties      = ARRAY['Faciales y Tratamientos'],
  zones            = ARRAY['Cancún'],
  experience_years = 1,
  is_litsea_grad   = false,
  is_verified      = false
WHERE user_id = 'b0000000-0000-0000-0000-000000000003';


-- ============================================================
-- 3. COMPLETAR PERFILES DE EMPLEADORES
-- ============================================================

UPDATE public.employer_profiles SET
  website     = 'https://www.hyatt.com/grand-hyatt/es-ES/cancun',
  description = 'Hotel de lujo 5 estrellas en la Riviera Maya con spa de clase mundial. Ofrecemos servicios de bienestar integral para huéspedes internacionales.',
  slug        = 'grand-hyatt-playa-del-carmen'
WHERE user_id = 'c0000000-0000-0000-0000-000000000001';

UPDATE public.employer_profiles SET
  website     = 'https://www.fiestamericana.com',
  description = 'Resort all-inclusive frente al mar Caribe. Nuestro spa Coral ofrece tratamientos exclusivos con ingredientes naturales de la región.',
  slug        = 'fiesta-americana-coral-beach'
WHERE user_id = 'c0000000-0000-0000-0000-000000000002';


-- ============================================================
-- 4. VACANTES, APLICACIONES, CONVERSACIONES, MENSAJES,
--    CERTIFICADOS Y OPINIONES
-- ============================================================

DO $$
DECLARE
  v_grand_hyatt_ep_id   UUID;
  v_fiesta_ep_id        UUID;
  v_maria_tp_id         UUID;
  v_carlos_tp_id        UUID;
  v_ana_tp_id           UUID;
  v_admin_id            UUID := 'a0000000-0000-0000-0000-000000000001';
  v_maria_id            UUID := 'b0000000-0000-0000-0000-000000000001';
  v_carlos_id           UUID := 'b0000000-0000-0000-0000-000000000002';
  v_grand_hyatt_user_id UUID := 'c0000000-0000-0000-0000-000000000001';
  v_vac1_id             UUID;
  v_vac2_id             UUID;
  v_vac3_id             UUID;
  v_vac4_id             UUID;
  v_vac5_id             UUID;
  v_app1_id             UUID;
  v_app2_id             UUID;
  v_app3_id             UUID;
  v_app4_id             UUID;
  v_conv1_id            UUID;
BEGIN

  -- Obtener IDs de employer_profiles y therapist_profiles (creados por el trigger)
  SELECT id INTO v_grand_hyatt_ep_id FROM public.employer_profiles WHERE user_id = 'c0000000-0000-0000-0000-000000000001';
  SELECT id INTO v_fiesta_ep_id      FROM public.employer_profiles WHERE user_id = 'c0000000-0000-0000-0000-000000000002';
  SELECT id INTO v_maria_tp_id       FROM public.therapist_profiles WHERE user_id = 'b0000000-0000-0000-0000-000000000001';
  SELECT id INTO v_carlos_tp_id      FROM public.therapist_profiles WHERE user_id = 'b0000000-0000-0000-0000-000000000002';
  SELECT id INTO v_ana_tp_id         FROM public.therapist_profiles WHERE user_id = 'b0000000-0000-0000-0000-000000000003';


  -- ----------------------------------------------------------
  -- VACANTES
  -- ----------------------------------------------------------

  -- Vacante 1: Grand Hyatt — Terapeuta Masajes Sueco (destacada)
  INSERT INTO public.vacancies (
    employer_id, title, description, location, position_type,
    contract_type, specialties, is_featured, is_active, created_at
  ) VALUES (
    v_grand_hyatt_ep_id,
    'Terapeuta de Masajes Sueco',
    'Buscamos terapeuta certificado en masaje sueco para nuestro spa de clase mundial. El candidato ideal tiene experiencia en hoteles de lujo, excelente presentación y pasión por el bienestar. Ofrecemos prestaciones superiores de ley, uniforme, comedor de personal y capacitación continua.',
    'Cancún',
    'Terapeuta',
    'Tiempo completo',
    ARRAY['Masoterapia Sueca', 'Reflexología'],
    true, true,
    NOW() - INTERVAL '10 days'
  ) RETURNING id INTO v_vac1_id;

  -- Vacante 2: Grand Hyatt — Reflexólogo (activa)
  INSERT INTO public.vacancies (
    employer_id, title, description, location, position_type,
    contract_type, specialties, is_featured, is_active, created_at
  ) VALUES (
    v_grand_hyatt_ep_id,
    'Reflexólogo/a Certificado/a',
    'Incorporamos reflexólogo con mínimo 2 años de experiencia en spa de hotel. Requisito: certificación Litsea o equivalente. Horario rotativo de lunes a domingo con 2 días de descanso entre semana.',
    'Playa del Carmen',
    'Terapeuta',
    'Tiempo completo',
    ARRAY['Reflexología', 'Masoterapia Sueca'],
    false, true,
    NOW() - INTERVAL '7 days'
  ) RETURNING id INTO v_vac2_id;

  -- Vacante 3: Grand Hyatt — Terapeuta Piedras Calientes (activa)
  INSERT INTO public.vacancies (
    employer_id, title, description, location, position_type,
    contract_type, specialties, is_featured, is_active, created_at
  ) VALUES (
    v_grand_hyatt_ep_id,
    'Terapeuta de Piedras Calientes',
    'Posición de temporada alta para terapeuta especializado en masaje con piedras volcánicas. Temporada diciembre 2026 - abril 2027. Alojamiento disponible cerca del hotel.',
    'Tulum',
    'Terapeuta',
    'Por temporada',
    ARRAY['Masaje con Piedras Calientes', 'Aromaterapia'],
    false, true,
    NOW() - INTERVAL '3 days'
  ) RETURNING id INTO v_vac3_id;

  -- Vacante 4: Fiesta Americana — Terapeuta de Aromaterapia (destacada)
  INSERT INTO public.vacancies (
    employer_id, title, description, location, position_type,
    contract_type, specialties, is_featured, is_active, created_at
  ) VALUES (
    v_fiesta_ep_id,
    'Terapeuta de Aromaterapia y Drenaje Linfático',
    'Coral Spa busca terapeuta especializado en aromaterapia y drenaje linfático manual. Buscamos profesional con vocación de servicio, inglés intermedio y disponibilidad para trabajar fines de semana.',
    'Cancún',
    'Terapeuta',
    'Tiempo completo',
    ARRAY['Aromaterapia', 'Drenaje Linfático'],
    true, true,
    NOW() - INTERVAL '5 days'
  ) RETURNING id INTO v_vac4_id;

  -- Vacante 5: Fiesta Americana — Esteticista Facial (borrador/inactiva)
  INSERT INTO public.vacancies (
    employer_id, title, description, location, position_type,
    contract_type, specialties, is_featured, is_active, created_at
  ) VALUES (
    v_fiesta_ep_id,
    'Esteticista Facial',
    'Buscamos esteticista con experiencia en tratamientos faciales profesionales, limpieza profunda y manejo de aparatología.',
    'Cancún',
    'Esteticista',
    'Por temporada',
    ARRAY['Faciales y Tratamientos'],
    false, false,
    NOW() - INTERVAL '1 day'
  ) RETURNING id INTO v_vac5_id;


  -- ----------------------------------------------------------
  -- APLICACIONES
  -- ----------------------------------------------------------

  -- App 1: María → Grand Hyatt Masajes Sueco → chat_enabled
  INSERT INTO public.applications (vacancy_id, therapist_id, status, notes, created_at)
  VALUES (
    v_vac1_id, v_maria_tp_id, 'chat_enabled',
    'Perfil excelente. Egresada Litsea con 5 años de experiencia. Chat habilitado el 12/05/2026.',
    NOW() - INTERVAL '8 days'
  ) RETURNING id INTO v_app1_id;

  -- App 2: Carlos → Fiesta Americana Aromaterapia → reviewing
  INSERT INTO public.applications (vacancy_id, therapist_id, status, notes, created_at)
  VALUES (
    v_vac4_id, v_carlos_tp_id, 'reviewing',
    'Candidato interesante. Validar certificados de Litsea antes de habilitar chat.',
    NOW() - INTERVAL '4 days'
  ) RETURNING id INTO v_app2_id;

  -- App 3: Ana → Grand Hyatt Masajes Sueco → new (recién llegada)
  INSERT INTO public.applications (vacancy_id, therapist_id, status, created_at)
  VALUES (
    v_vac1_id, v_ana_tp_id, 'new',
    NOW() - INTERVAL '1 day'
  ) RETURNING id INTO v_app3_id;

  -- App 4: María → Grand Hyatt Reflexólogo → hired
  INSERT INTO public.applications (vacancy_id, therapist_id, status, notes, created_at)
  VALUES (
    v_vac2_id, v_maria_tp_id, 'hired',
    'Contratada para la posición. Inicia el 1 de junio 2026.',
    NOW() - INTERVAL '15 days'
  ) RETURNING id INTO v_app4_id;


  -- ----------------------------------------------------------
  -- CONVERSACIÓN (solo para la app con chat_enabled)
  -- ----------------------------------------------------------

  INSERT INTO public.conversations (application_id, therapist_id, employer_id, is_active, created_at)
  VALUES (
    v_app1_id,
    v_maria_id,
    v_grand_hyatt_user_id,
    true,
    NOW() - INTERVAL '6 days'
  ) RETURNING id INTO v_conv1_id;


  -- ----------------------------------------------------------
  -- MENSAJES EN LA CONVERSACIÓN
  -- ----------------------------------------------------------

  INSERT INTO public.messages (conversation_id, sender_id, body, read_at, created_at) VALUES

    (v_conv1_id, v_grand_hyatt_user_id,
     'Hola María, revisamos tu perfil y nos pareció excelente. ¿Tienes disponibilidad para una entrevista esta semana?',
     NOW() - INTERVAL '5 days 22 hours',
     NOW() - INTERVAL '6 days'),

    (v_conv1_id, v_maria_id,
     '¡Hola! Muchas gracias. Sí, tengo disponibilidad miércoles y jueves por la mañana. ¿Qué horario les funciona?',
     NOW() - INTERVAL '5 days 20 hours',
     NOW() - INTERVAL '5 days 23 hours'),

    (v_conv1_id, v_grand_hyatt_user_id,
     'Perfecto. Quedamos el miércoles 15 de mayo a las 10:00 am en nuestras oficinas de RRHH en el hotel. ¿Le parece bien?',
     NOW() - INTERVAL '5 days 18 hours',
     NOW() - INTERVAL '5 days 20 hours'),

    (v_conv1_id, v_maria_id,
     'Confirmado, estaré puntual. ¿Necesito llevar algún documento en especial?',
     NOW() - INTERVAL '5 days 16 hours',
     NOW() - INTERVAL '5 days 18 hours'),

    (v_conv1_id, v_grand_hyatt_user_id,
     'Solo su identificación y copias de sus certificados. Todo lo demás lo vemos en la entrevista. ¡Hasta el miércoles!',
     NULL,
     NOW() - INTERVAL '5 days 15 hours');


  -- ----------------------------------------------------------
  -- CERTIFICADOS DE TERAPEUTAS
  -- ----------------------------------------------------------

  INSERT INTO public.certificates (therapist_id, title, issued_by, issued_at, file_url, verified, created_at) VALUES

    -- María: 2 certificados verificados
    (v_maria_tp_id,
     'Masoterapia Sueca Avanzada',
     'Litsea Centro de Capacitación',
     '2022-06-15',
     'certificates/maria-masoterapia-sueca.pdf',
     true,
     NOW() - INTERVAL '30 days'),

    (v_maria_tp_id,
     'Reflexología Podal',
     'Litsea Centro de Capacitación',
     '2023-03-10',
     'certificates/maria-reflexologia.pdf',
     true,
     NOW() - INTERVAL '25 days'),

    -- Carlos: 1 certificado verificado, 1 pendiente
    (v_carlos_tp_id,
     'Aromaterapia Profesional',
     'Litsea Centro de Capacitación',
     '2023-09-20',
     'certificates/carlos-aromaterapia.pdf',
     true,
     NOW() - INTERVAL '20 days'),

    (v_carlos_tp_id,
     'Drenaje Linfático Manual',
     'Litsea Centro de Capacitación',
     '2024-01-15',
     'certificates/carlos-drenaje-linfatico.pdf',
     false,
     NOW() - INTERVAL '5 days');


  -- ----------------------------------------------------------
  -- AUDIT LOGS DE EJEMPLO
  -- ----------------------------------------------------------

  INSERT INTO public.audit_logs (admin_id, action, module, record_id, details, created_at) VALUES

    (v_admin_id,
     'verify_therapist',
     'terapeutas',
     v_maria_tp_id::TEXT,
     '{"therapist": "María García López", "accion": "Perfil verificado tras revisar certificados Litsea"}'::jsonb,
     NOW() - INTERVAL '20 days'),

    (v_admin_id,
     'verify_therapist',
     'terapeutas',
     v_carlos_tp_id::TEXT,
     '{"therapist": "Carlos Ruiz Mendoza", "accion": "Perfil verificado"}'::jsonb,
     NOW() - INTERVAL '18 days'),

    (v_admin_id,
     'verify_certificate',
     'certificados',
     'maria-cert-1',
     '{"terapeuta": "María García López", "certificado": "Masoterapia Sueca Avanzada"}'::jsonb,
     NOW() - INTERVAL '28 days'),

    (v_admin_id,
     'enable_chat',
     'aplicaciones',
     v_app1_id::TEXT,
     '{"terapeuta": "María García López", "empresa": "Grand Hyatt Playa del Carmen", "vacante": "Terapeuta de Masajes Sueco"}'::jsonb,
     NOW() - INTERVAL '6 days'),

    (v_admin_id,
     'change_application_status',
     'aplicaciones',
     v_app4_id::TEXT,
     '{"terapeuta": "María García López", "status_anterior": "chat_enabled", "status_nuevo": "hired"}'::jsonb,
     NOW() - INTERVAL '10 days');

END $$;


-- ============================================================
-- 5. OPINIONES (no requieren auth — inserción pública)
-- ============================================================

INSERT INTO public.opiniones (nombre, email, cargo, empresa, contenido, rating, status, revisado_by, revisado_at, created_at)
VALUES

  -- 3 opiniones aprobadas (aparecen en el home)
  (
    'María G.',
    'maria.garcia@test.litsea.mx',
    'Terapeuta Certificada',
    NULL,
    'Gracias a Litsea Empleos encontré trabajo en el Grand Hyatt en menos de dos semanas. El proceso fue muy transparente y el equipo siempre estuvo disponible para resolver mis dudas.',
    5,
    'approved',
    'a0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '12 days'
  ),
  (
    'Roberto H.',
    'rh.director@grandhyatt-test.litsea.mx',
    'Director de Spa',
    'Grand Hyatt Playa del Carmen',
    'La plataforma nos ha facilitado enormemente la búsqueda de talento certificado. Los perfiles son verificados y la calidad de los candidatos es notablemente superior a otras bolsas de trabajo.',
    5,
    'approved',
    'a0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    'Carlos R.',
    'carlos.ruiz@test.litsea.mx',
    'Terapeuta de Aromaterapia',
    NULL,
    'Excelente plataforma. Me permitió mostrar mis certificaciones Litsea y conectar con empleadores serios. La atención del equipo es muy profesional.',
    4,
    'approved',
    'a0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '6 days'
  ),

  -- 1 opinión pendiente de moderar
  (
    'Sofía M.',
    'sofia.mendez@correo.com',
    'Terapeuta',
    'Hotel Azul Tulum',
    'Muy buena experiencia. La plataforma es fácil de usar y los empleadores que publican vacantes son empresas reconocidas de la región.',
    4,
    'pending',
    NULL,
    NULL,
    NOW() - INTERVAL '1 day'
  ),

  -- 1 opinión rechazada (spam/irrelevante)
  (
    'Juan P.',
    'spam@correo.com',
    NULL,
    NULL,
    'Buena plataforma pero me gustaría que también tuvieran opciones para trabajos en CDMX y Monterrey no solo en la Riviera Maya.',
    3,
    'rejected',
    'a0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '7 days'
  );


SELECT 'Seed ejecutado correctamente.' AS status;
