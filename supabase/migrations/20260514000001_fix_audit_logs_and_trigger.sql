ALTER TABLE public.audit_logs ALTER COLUMN admin_id DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
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
