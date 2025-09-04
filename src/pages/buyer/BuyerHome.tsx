import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingCart, 
  Gift, 
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

const BuyerHome = () => {
  const { user } = useUserRole();

  const recentViews = [
    { id: "1", name: "Banarasi Silk Saree", price: 15000, artisan: "Meera Devi" },
    { id: "2", name: "Blue Pottery Bowl", price: 2500, artisan: "Rajesh Kumar" },
    { id: "3", name: "Silver Filigree Box", price: 8500, artisan: "Lakshmi Nayak" }
  ];

  const recommendedMotifs = [
    { name: "Paisley", trend: "+15%" },
    { name: "Mandala", trend: "+8%" },
    { name: "Floral", trend: "+12%" }
  ];

  const activeOffers = [
    { id: "1", title: "20% off on Textiles", expires: "2 days", code: "TEXTILE20" },
    { id: "2", title: "Free shipping over ₹5000", expires: "5 days", code: "FREESHIP" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold">
              Welcome back, <span className="text-primary">{user?.displayName}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover new stories and support local artisans
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                    <Gift className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{user?.points}</p>
                    <p className="text-sm text-muted-foreground">Points • {user?.tier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button asChild variant="cultural" className="h-16 group">
            <Link to="/market" className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Explore</p>
                <p className="text-xs opacity-90">New Arrivals</p>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-16 group">
            <Link to="/buyer/wishlist" className="flex items-center gap-3">
              <Heart className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Wishlist</p>
                <p className="text-xs text-muted-foreground">5 items</p>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-16 group">
            <Link to="/buyer/cart" className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Cart</p>
                <p className="text-xs text-muted-foreground">3 items</p>
              </div>
            </Link>
          </Button>

          <Button asChild variant="accent" className="h-16 group">
            <Link to="/buyer/rewards" className="flex items-center gap-3">
              <Star className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Rewards</p>
                <p className="text-xs opacity-90">Redeem Now</p>
              </div>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Views */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-playfair font-semibold">Recent Views</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/market">View All</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentViews.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">by {item.artisan}</p>
                      </div>
                      <p className="font-bold text-primary">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-playfair font-semibold">AI Recommendations</h2>
                    <p className="text-sm text-muted-foreground">Based on your preferences</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {recommendedMotifs.map((motif, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <h3 className="font-semibold mb-1">{motif.name}</h3>
                      <Badge variant="eco" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {motif.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Offers */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-playfair font-semibold mb-4">Active Offers</h2>
                <div className="space-y-4">
                  {activeOffers.map((offer) => (
                    <div key={offer.id} className="p-4 rounded-lg bg-gradient-accent/10 border border-accent/20">
                      <h3 className="font-semibold text-accent-foreground mb-1">{offer.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {offer.expires}
                        </span>
                        <code className="bg-accent/20 px-2 py-1 rounded text-xs font-mono">
                          {offer.code}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Requests Status */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-playfair font-semibold mb-4">Custom Orders</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Silver Ring Set</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Custom Saree</span>
                    <Badge variant="cultural">Quoted</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/buyer/custom-requests">View All</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Trending Regions */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-playfair font-semibold mb-4">Trending Regions</h2>
                <div className="space-y-3">
                  {['Rajasthan', 'Kerala', 'West Bengal'].map((region, index) => (
                    <div key={region} className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>{region}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;