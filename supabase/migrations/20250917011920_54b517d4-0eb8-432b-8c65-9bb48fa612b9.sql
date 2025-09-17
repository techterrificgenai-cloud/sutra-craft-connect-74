-- Drop the existing buyers table and recreate with correct structure
DROP TABLE IF EXISTS public.buyers;

-- Create buyers table with correct structure
CREATE TABLE public.buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text UNIQUE,
  phone text,
  address text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on buyers table
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for buyers table
CREATE POLICY "Users can view their own buyer profile" ON public.buyers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buyer profile" ON public.buyers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer profile" ON public.buyers
  FOR UPDATE USING (auth.uid() = user_id);

-- Update handle_new_user function to create buyer profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, display_name, phone, photo_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.phone,
    NEW.raw_user_meta_data ->> 'photo_url',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'buyer')
  );
  
  -- Insert into buyers table
  INSERT INTO public.buyers (user_id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.email,
    NEW.phone
  );
  
  RETURN NEW;
END;
$$;