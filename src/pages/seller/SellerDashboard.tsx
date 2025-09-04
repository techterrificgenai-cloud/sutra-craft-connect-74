import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Eye, 
  Heart,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Package,
  Star,
  AlertCircle,
  Sparkles,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const stats = [
    { label: "Total Views", value: "2,847", change: "+12%", icon: Eye },
    { label: "Wishlist Saves", value: "156", change: "+8%", icon: Heart },
    { label: "Orders", value: "23", change: "+15%", icon: ShoppingCart },
    { label: "Messages", value: "7", change: "New", icon: MessageSquare }
  ];

  const recentOrders = [
    { id: "ORD-001", item: "Banarasi Saree", customer: "Priya S.", status: "shipped", amount: 15000 },
    { id: "ORD-002", item: "Blue Pottery Set", customer: "Amit K.", status: "in_progress", amount: 2500 },
    { id: "ORD-003", item: "Silver Box", customer: "Maya R.", status: "delivered", amount: 8500 }
  ];

  const pendingTasks = [
    { type: "quote", message: "Custom ring set inquiry from David C.", urgent: true },
    { type: "kyc", message: "Complete KYC verification for verified badge", urgent: false },
    { type: "story", message: "Add AI story to 3 products for better reach", urgent: false }
  ];

  const trendingTopics = [
    { name: "Sustainable Crafts", growth: "+25%" },
    { name: "Bridal Collections", growth: "+18%" },
    { name: "Home Decor", growth: "+12%" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold">
              Seller <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your crafts and grow your business with AI
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/seller/ai">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Studio
              </Link>
            </Button>
            <Button variant="cultural" asChild>
              <Link to="/seller/catalog">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-card border-0 shadow-soft hover:shadow-cultural transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <Badge 
                        variant={stat.change.includes('+') ? 'eco' : 'secondary'} 
                        className="mt-2 text-xs"
                      >
                        {stat.change.includes('+') && <TrendingUp className="h-3 w-3 mr-1" />}
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-cultural flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Tasks */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-playfair font-semibold">Pending Tasks</h2>
                  <Badge variant="destructive" className="text-xs">
                    {pendingTasks.filter(task => task.urgent).length} Urgent
                  </Badge>
                </div>

                <div className="space-y-4">
                  {pendingTasks.map((task, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        task.urgent ? 'border-destructive/20 bg-destructive/5' : 'border-border/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.urgent && <AlertCircle className="h-4 w-4 text-destructive" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.message}</p>
                          <Badge 
                            variant={task.type === 'quote' ? 'cultural' : task.type === 'kyc' ? 'verified' : 'ai'} 
                            className="mt-2 text-xs"
                          >
                            {task.type}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          Action
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-playfair font-semibold">Recent Orders</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/seller/orders">View All</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{order.item}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.id} • {order.customer}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{order.amount.toLocaleString()}</p>
                        <Badge 
                          variant={
                            order.status === 'delivered' ? 'eco' : 
                            order.status === 'shipped' ? 'cultural' : 'secondary'
                          }
                          className="text-xs mt-1"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-xl font-playfair font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button variant="cultural" size="sm" className="w-full justify-start" asChild>
                    <Link to="/seller/leads">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond to Leads
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link to="/seller/catalog">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link to="/seller/pricing">
                      <Star className="h-4 w-4 mr-2" />
                      Create Offer
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-playfair font-semibold">AI Insights</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm font-medium text-primary mb-1">Optimization Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Add voice stories to increase views by 40%
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                    <p className="text-sm font-medium text-accent-foreground mb-1">Pricing Suggestion</p>
                    <p className="text-xs text-muted-foreground">
                      Consider 10% seasonal discount for textiles
                    </p>
                  </div>
                </div>

                <Button variant="ai" size="sm" className="w-full mt-4" asChild>
                  <Link to="/seller/ai">
                    Get More Insights
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-playfair font-semibold">Trending Now</h2>
                </div>
                
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{topic.name}</span>
                      <Badge variant="eco" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {topic.growth}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/seller/trends">
                    View All Trends
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;