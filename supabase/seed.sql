INSERT INTO public.users (id, email, name, role, is_active)
SELECT
  id,
  email,
  'Admin',
  'admin'::user_role,
  true
FROM auth.users
WHERE email = 'appbmcc@gmail.com'
ON CONFLICT (email) DO NOTHING;
