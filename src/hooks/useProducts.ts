import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  photos: string[];
  variants: any;
  tags: string[];
  eco_badge: boolean;
  cultural_badge: boolean;
  story_text?: string;
  story_audio_url?: string;
  story_language: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  seller?: {
    shop_name: string;
    verified_badge: boolean;
    rating: number;
    region?: string;
  };
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:sellers(shop_name, verified_badge, rating, region)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToWishlist = async (productId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: userId, product_id: productId });
      
      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }
      return true;
    } catch (err: any) {
      console.error('Error adding to wishlist:', err);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      return false;
    }
  };

  const addToCart = async (productId: string, userId: string, quantity: number = 1, variantId?: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      const { error } = await supabase
        .from('carts')
        .upsert({
          user_id: userId,
          product_id: productId,
          quantity,
          variant_id: variantId,
          price_at_add: product.price
        });
      
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addToWishlist,
    removeFromWishlist,
    addToCart
  };
};