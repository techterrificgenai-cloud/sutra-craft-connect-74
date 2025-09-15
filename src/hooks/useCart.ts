import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  variant_id?: string;
  price_at_add: number;
  created_at: string;
  product?: {
    title: string;
    photos: string[];
    stock: number;
    seller_id: string;
  };
}

export const useCart = (userId?: string) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    if (!userId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('carts')
        .select(`
          *,
          product:products(title, photos, stock, seller_id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCartItems(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        return removeItem(itemId);
      }

      const { error } = await supabase
        .from('carts')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await fetchCart();
      return true;
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchCart();
      return true;
    } catch (err: any) {
      console.error('Error removing item:', err);
      return false;
    }
  };

  const clearCart = async () => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      setCartItems([]);
      return true;
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      return false;
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price_at_add * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cartItems,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart,
    totalAmount: getTotalAmount(),
    itemCount: getItemCount()
  };
};