-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN email text;

-- Create unique index on email
CREATE UNIQUE INDEX profiles_email_key ON public.profiles(email);

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile with email
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.phone,
    NEW.email
  );
  
  -- Assign default 'public' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'public');
  
  RETURN NEW;
END;
$function$;

-- Backfill existing profiles with email from auth.users
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;

-- Make email not nullable after backfill
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;