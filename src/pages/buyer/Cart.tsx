import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/useCart';
import { useUserRole } from '@/hooks/useUserRole';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const { user } = useUserRole();
  const { cartItems, loading, updateQuantity, removeItem, totalAmount, clearCart } = useCart(user?.id);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const { toast } = useToast();

  const shipping = totalAmount > 5000 ? 0 : 200;
  const tax = totalAmount * 0.05; // 5% tax
  const finalTotal = totalAmount - discount + shipping + tax;

  const applyPromoCode = async () => {
    try {
      const { data: offer } = await supabase
        .from('offers')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('active', true)
        .single();

      if (offer) {
        const discountAmount = offer.type === 'percent' 
          ? (totalAmount * offer.value) / 100
          : offer.value;
        
        setDiscount(Math.min(discountAmount, totalAmount));
        toast({
          title: "Promo code applied!",
          description: `You saved ₹${discountAmount}`,
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: "Please check your code and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error applying promo code",
        variant: "destructive"
      });
    }
  };

  const placeOrder = async () => {
    if (!user || cartItems.length === 0) return;
    if (!shippingAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your shipping address.",
        variant: "destructive"
      });
      return;
    }

    setPlacing(true);
    try {
      // Group items by seller
      const itemsBySeller = cartItems.reduce((acc, item) => {
        const sellerId = item.product?.seller_id;
        if (!sellerId) return acc;
        
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(item);
        return acc;
      }, {} as Record<string, typeof cartItems>);

      // Create separate orders for each seller
      for (const [sellerId, items] of Object.entries(itemsBySeller)) {
        const orderItems = items.map(item => ({
          product_id: item.product_id,
          title: item.product?.title,
          quantity: item.quantity,
          price: item.price_at_add
        }));

        const orderSubtotal = items.reduce((sum, item) => sum + (item.price_at_add * item.quantity), 0);
        const orderDiscount = (discount * orderSubtotal) / totalAmount;
        const orderShipping = shipping / Object.keys(itemsBySeller).length;
        const orderTax = (tax * orderSubtotal) / totalAmount;
        const orderTotal = orderSubtotal - orderDiscount + orderShipping + orderTax;

        const { error } = await supabase
          .from('orders')
          .insert({
            buyer_id: user.id,
            seller_id: sellerId,
            items: orderItems,
            subtotal: orderSubtotal,
            discount: orderDiscount,
            shipping: orderShipping,
            tax: orderTax,
            total: orderTotal,
            shipping_address: { address: shippingAddress },
            payment_method: 'card',
            status: 'placed'
          });

        if (error) throw error;
      }

      // Clear cart and award points
      await clearCart();
      
      // Award points (1 point per ₹100)
      const pointsEarned = Math.floor(finalTotal / 100);
      if (pointsEarned > 0) {
        await supabase
          .from('points_ledger')
          .insert({
            user_id: user.id,
            type: 'earn',
            points: pointsEarned,
            note: 'Points earned from purchase'
          });
      }

      toast({
        title: "Order placed successfully!",
        description: `You earned ${pointsEarned} points on this purchase.`,
      });

    } catch (error: any) {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-playfair font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some beautiful crafts to your cart</p>
          <Button variant="cultural" asChild>
            <a href="/market">Explore Marketplace</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-playfair font-bold">Shopping Cart</h1>
          <Badge variant="outline">{cartItems.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="glass-card border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                      {item.product?.photos?.[0] && (
                        <img 
                          src={item.product.photos[0]} 
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product?.title}</h3>
                      <p className="text-sm text-muted-foreground">₹{item.price_at_add}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="font-bold text-primary">
                      ₹{(item.price_at_add * item.quantity).toLocaleString()}
                    </p>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="glass-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="glass-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your complete address..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Place Order */}
            <Button 
              variant="cultural" 
              size="lg" 
              className="w-full"
              onClick={placeOrder}
              disabled={placing || !shippingAddress.trim()}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {placing ? 'Placing Order...' : `Place Order • ₹${finalTotal.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;