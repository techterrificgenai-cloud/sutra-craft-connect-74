import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Gift, 
  Star, 
  Sparkles, 
  TrendingUp,
  Clock,
  Award,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PointsTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'adjust';
  points: number;
  note: string;
  created_at: string;
}

interface Offer {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_cart_amount?: number;
  first_order_only: boolean;
  expires_at?: string;
}

const Rewards = () => {
  const { user, updatePoints } = useUserRole();
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);
  const [redeemAmount, setRedeemAmount] = useState([0]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const maxRedeemPoints = Math.min(user?.points || 0, 2000); // Max 2000 points redemption
  const redeemValue = Math.floor(redeemAmount[0] / 5); // 5 points = ₹1

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch points history
      const { data: history } = await supabase
        .from('points_ledger')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch available offers
      const { data: offers } = await supabase
        .from('offers')
        .select('*')
        .eq('active', true)
        .or('expires_at.is.null,expires_at.gt.now()')
        .limit(5);

      setPointsHistory((history || []) as PointsTransaction[]);
      setAvailableOffers((offers || []) as Offer[]);
    } catch (error: any) {
      toast({
        title: "Error loading rewards data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemPoints = async () => {
    if (!user || redeemAmount[0] === 0) return;

    try {
      // Create redemption entry
      const { error } = await supabase
        .from('points_ledger')
        .insert({
          user_id: user.id,
          type: 'redeem',
          points: -redeemAmount[0],
          note: `Redeemed ${redeemAmount[0]} points for ₹${redeemValue} discount`
        });

      if (error) throw error;

      // Update user points
      await updatePoints(-redeemAmount[0]);
      
      toast({
        title: "Points redeemed!",
        description: `You now have ₹${redeemValue} discount available for your next order.`,
      });

      setRedeemAmount([0]);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error redeeming points",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getTierProgress = () => {
    const points = user?.points || 0;
    if (points < 500) return { current: 'Bronze', next: 'Silver', progress: (points / 500) * 100, needed: 500 - points };
    if (points < 1000) return { current: 'Silver', next: 'Gold', progress: ((points - 500) / 500) * 100, needed: 1000 - points };
    return { current: 'Gold', next: null, progress: 100, needed: 0 };
  };

  const tierInfo = getTierProgress();

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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-playfair font-bold">Rewards & Benefits</h1>
          <p className="text-muted-foreground mt-2">
            Earn points with every purchase and unlock exclusive benefits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Points Overview */}
          <Card className="glass-card border-0 shadow-cultural">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>Your Points</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <p className="text-4xl font-bold text-primary">{user?.points || 0}</p>
                <p className="text-sm text-muted-foreground">Available Points</p>
              </div>
              
              <Badge variant="cultural" className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                {user?.tier} Tier
              </Badge>

              {tierInfo.next && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {tierInfo.next}</span>
                    <span>{tierInfo.needed} points needed</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tierInfo.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Point Redemption */}
          <Card className="glass-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Redeem Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Points to Redeem</span>
                  <span>{redeemAmount[0]} points</span>
                </div>
                <Slider
                  value={redeemAmount}
                  onValueChange={setRedeemAmount}
                  max={maxRedeemPoints}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{maxRedeemPoints}</span>
                </div>
              </div>

              {redeemAmount[0] > 0 && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-center font-semibold">
                    ₹{redeemValue} Discount
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    Usable on your next order
                  </p>
                </div>
              )}

              <Button 
                variant="cultural" 
                className="w-full"
                onClick={redeemPoints}
                disabled={redeemAmount[0] === 0}
              >
                Redeem {redeemAmount[0]} Points
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• 5 points = ₹1 discount</p>
                <p>• Maximum 2000 points per redemption</p>
                <p>• Discount expires in 30 days</p>
              </div>
            </CardContent>
          </Card>

          {/* Earning Rules */}
          <Card className="glass-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                How to Earn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-eco/10">
                  <TrendingUp className="h-5 w-5 text-eco" />
                  <div>
                    <p className="font-semibold text-sm">Purchase</p>
                    <p className="text-xs text-muted-foreground">1 point per ₹100 spent</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-cultural/10">
                  <Star className="h-5 w-5 text-cultural" />
                  <div>
                    <p className="font-semibold text-sm">Review</p>
                    <p className="text-xs text-muted-foreground">50 points per review</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                  <div>
                    <p className="font-semibold text-sm">Referral</p>
                    <p className="text-xs text-muted-foreground">200 points per friend</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <h4 className="font-semibold mb-2">Tier Benefits</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bronze</span>
                    <span>1× points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Silver</span>
                    <span>1.2× points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold</span>
                    <span>1.5× points</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Offers */}
          <Card className="glass-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Available Offers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableOffers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active offers at the moment
                </p>
              ) : (
                availableOffers.map((offer) => (
                  <div key={offer.id} className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">
                          {offer.type === 'percent' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                        </p>
                        {offer.min_cart_amount && (
                          <p className="text-sm text-muted-foreground">
                            Min. order ₹{offer.min_cart_amount}
                          </p>
                        )}
                      </div>
                      {offer.expires_at && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Expires {new Date(offer.expires_at).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {offer.code}
                    </code>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Points History */}
          <Card className="glass-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pointsHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No transaction history yet
                </p>
              ) : (
                pointsHistory.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'earn' 
                          ? 'bg-eco/20 text-eco' 
                          : transaction.type === 'redeem'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {transaction.type === 'earn' ? '+' : transaction.type === 'redeem' ? '-' : '~'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.note}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'earn' ? 'text-eco' : 'text-destructive'
                    }`}>
                      {transaction.type === 'earn' ? '+' : ''}{transaction.points}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rewards;