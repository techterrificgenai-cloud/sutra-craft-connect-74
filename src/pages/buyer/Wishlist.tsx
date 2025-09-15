import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    price: number;
    photos: string[];
    eco_badge: boolean;
    cultural_badge: boolean;
    seller: {
      shop_name: string;
      verified_badge: boolean;
    };
  };
}

const Wishlist = () => {
  const { user } = useUserRole();
  const { addToCart } = useProducts();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          product:products(
            id, title, price, photos, eco_badge, cultural_badge,
            seller:sellers(shop_name, verified_badge)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading wishlist",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Removed from wishlist",
      });
    } catch (error: any) {
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const moveToCart = async (productId: string, itemId: string) => {
    if (!user) return;

    const success = await addToCart(productId, user.id);
    if (success) {
      await removeFromWishlist(itemId);
      toast({
        title: "Moved to cart",
        description: "Item has been added to your cart",
      });
    } else {
      toast({
        title: "Error adding to cart",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-playfair font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love for later</p>
          <Button variant="cultural" asChild>
            <a href="/market">Explore Marketplace</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-playfair font-bold">My Wishlist</h1>
          <Badge variant="outline">{wishlistItems.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="glass-card border-0 shadow-soft hover:shadow-cultural transition-all duration-300">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={item.product.photos[0] || '/placeholder.svg'}
                    alt={item.product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {item.product.seller?.shop_name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.product.eco_badge && (
                      <Badge variant="eco" className="text-xs">Eco</Badge>
                    )}
                    {item.product.cultural_badge && (
                      <Badge variant="cultural" className="text-xs">Cultural</Badge>
                    )}
                    {item.product.seller?.verified_badge && (
                      <Badge variant="verified" className="text-xs">Verified</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                    <Button
                      variant="cultural"
                      size="sm"
                      onClick={() => moveToCart(item.product.id, item.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;