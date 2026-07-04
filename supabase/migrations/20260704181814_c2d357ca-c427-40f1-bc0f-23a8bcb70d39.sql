
-- Trigger: no more hardcoded admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone','')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $function$;

-- Move has_role to private schema
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- profiles
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
DROP POLICY IF EXISTS "admins manage profiles" ON public.profiles;
CREATE POLICY "profiles select own or admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
REVOKE SELECT ON public.profiles FROM anon;

-- user_roles
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- venues
DROP POLICY IF EXISTS "venues manage by staff" ON public.venues;
CREATE POLICY "venues manage by staff" ON public.venues
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'organizer'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'organizer'::app_role));

-- bookings
DROP POLICY IF EXISTS "bookings user select own" ON public.bookings;
DROP POLICY IF EXISTS "bookings user update own" ON public.bookings;
DROP POLICY IF EXISTS "bookings admin delete" ON public.bookings;
CREATE POLICY "bookings user select own" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'organizer'::app_role));
CREATE POLICY "bookings user update own" ON public.bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'organizer'::app_role))
  WITH CHECK (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'organizer'::app_role));
CREATE POLICY "bookings admin delete" ON public.bookings
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

-- payments
DROP POLICY IF EXISTS "payments user read own" ON public.payments;
DROP POLICY IF EXISTS "payments user insert own" ON public.payments;
DROP POLICY IF EXISTS "payments admin manage" ON public.payments;
DROP POLICY IF EXISTS "payments admin delete" ON public.payments;
CREATE POLICY "payments user read own" ON public.payments
  FOR SELECT TO authenticated
  USING (
    private.has_role(auth.uid(), 'admin'::app_role)
    OR private.has_role(auth.uid(), 'organizer'::app_role)
    OR EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid())
  );
CREATE POLICY "payments user insert own" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid())
    OR private.has_role(auth.uid(), 'admin'::app_role)
  );
CREATE POLICY "payments admin manage" ON public.payments
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "payments admin delete" ON public.payments
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Remove the publicly-exposed has_role
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
