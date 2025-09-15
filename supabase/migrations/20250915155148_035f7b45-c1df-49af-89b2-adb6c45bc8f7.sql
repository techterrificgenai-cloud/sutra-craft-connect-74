-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  photo_url TEXT,
  language TEXT DEFAULT 'en',
  points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold')),
  referral_code TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sellers table
CREATE TABLE public.sellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  bio TEXT,
  region TEXT,
  eco_badge BOOLEAN DEFAULT false,
  cultural_badge BOOLEAN DEFAULT false,
  verified_badge BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_sales INTEGER DEFAULT 0,
  style_profile JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  photos TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  eco_badge BOOLEAN DEFAULT false,
  cultural_badge BOOLEAN DEFAULT false,
  story_text TEXT,
  story_audio_url TEXT,
  story_language TEXT DEFAULT 'en',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom works table
CREATE TABLE public.custom_works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  story TEXT,
  outcome_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlists table
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create carts table
CREATE TABLE public.carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  variant_id TEXT,
  price_at_add DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'placed' CHECK (status IN ('placed', 'in_progress', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  custom_request_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom requests table
CREATE TABLE public.custom_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  brief_text TEXT NOT NULL,
  brief_photos TEXT[] DEFAULT '{}',
  budget DECIMAL(10,2),
  timeline_days INTEGER,
  materials TEXT,
  ai_preview_image_url TEXT,
  ai_preview_notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'accepted', 'in_progress', 'shipped', 'delivered', 'cancelled')),
  quote_amount DECIMAL(10,2),
  quote_timeline_days INTEGER,
  quote_milestones JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL,
  thread_type TEXT NOT NULL CHECK (thread_type IN ('custom_request', 'order')),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT,
  audio_url TEXT,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_cart_amount DECIMAL(10,2),
  first_order_only BOOLEAN DEFAULT false,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create points ledger table
CREATE TABLE public.points_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'adjust')),
  points INTEGER NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('product', 'seller', 'order')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for sellers
CREATE POLICY "Anyone can view sellers" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Users can manage their own seller profile" ON public.sellers FOR ALL USING (auth.uid() = user_id);

-- Create policies for products
CREATE POLICY "Anyone can view published products" ON public.products FOR SELECT USING (published = true);
CREATE POLICY "Sellers can manage their own products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE sellers.id = products.seller_id AND sellers.user_id = auth.uid())
);

-- Create policies for custom works
CREATE POLICY "Anyone can view custom works" ON public.custom_works FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their own custom works" ON public.custom_works FOR ALL USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE sellers.id = custom_works.seller_id AND sellers.user_id = auth.uid())
);

-- Create policies for wishlists
CREATE POLICY "Users can manage their own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Create policies for carts
CREATE POLICY "Users can manage their own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view their own orders as buyer" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view their own orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE sellers.id = orders.seller_id AND sellers.user_id = auth.uid())
);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update their order status" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE sellers.id = orders.seller_id AND sellers.user_id = auth.uid())
);

-- Create policies for custom requests
CREATE POLICY "Users can view custom requests they're involved in" ON public.custom_requests FOR SELECT USING (
  auth.uid() = buyer_id OR 
  EXISTS (SELECT 1 FROM public.sellers WHERE sellers.id = custom_requests.seller_id AND sellers.user_id = auth.uid())
);
CREATE POLICY "Buyers can create custom requests" ON public.custom_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Involved parties can update custom requests" ON public.custom_requests FOR UPDATE USING (
  auth.uid() = buyer_id OR 
  EXISTS (SELECT 1 FROM public.sellers WHERE sellers.id = custom_requests.seller_id AND sellers.user_id = auth.uid())
);

-- Create policies for messages
CREATE POLICY "Users can view messages in threads they're part of" ON public.messages FOR SELECT USING (
  auth.uid() = from_user_id OR
  (thread_type = 'custom_request' AND EXISTS (
    SELECT 1 FROM public.custom_requests cr 
    WHERE cr.id::text = thread_id AND (cr.buyer_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.sellers s WHERE s.id = cr.seller_id AND s.user_id = auth.uid()
    ))
  )) OR
  (thread_type = 'order' AND EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id::text = thread_id AND (o.buyer_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.sellers s WHERE s.id = o.seller_id AND s.user_id = auth.uid()
    ))
  ))
);
CREATE POLICY "Users can create messages in threads they're part of" ON public.messages FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Create policies for offers
CREATE POLICY "Anyone can view active offers" ON public.offers FOR SELECT USING (active = true);
CREATE POLICY "Sellers can manage their own offers" ON public.offers FOR ALL USING (
  seller_id IS NULL OR EXISTS (SELECT 1 FROM public.sellers WHERE sellers.id = offers.seller_id AND sellers.user_id = auth.uid())
);

-- Create policies for points ledger
CREATE POLICY "Users can view their own points ledger" ON public.points_ledger FOR SELECT USING (auth.uid() = user_id);

-- Create policies for reports
CREATE POLICY "Users can view their own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON public.sellers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_custom_requests_updated_at BEFORE UPDATE ON public.custom_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone, photo_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.phone,
    NEW.raw_user_meta_data ->> 'photo_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();