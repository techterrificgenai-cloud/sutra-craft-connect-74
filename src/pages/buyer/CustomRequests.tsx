import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  Truck,
  User,
  Upload,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomRequest {
  id: string;
  seller_id?: string;
  brief_text: string;
  brief_photos: string[];
  budget?: number;
  timeline_days?: number;
  materials?: string;
  status: 'new' | 'quoted' | 'accepted' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled';
  quote_amount?: number;
  quote_timeline_days?: number;
  ai_preview_notes?: string;
  created_at: string;
  seller?: {
    shop_name: string;
    verified_badge: boolean;
  };
}

const statusConfig = {
  new: { label: 'New Request', icon: Clock, variant: 'secondary' as const },
  quoted: { label: 'Quoted', icon: DollarSign, variant: 'cultural' as const },
  accepted: { label: 'Accepted', icon: CheckCircle, variant: 'eco' as const },
  in_progress: { label: 'In Progress', icon: User, variant: 'ai' as const },
  shipped: { label: 'Shipped', icon: Truck, variant: 'verified' as const },
  delivered: { label: 'Delivered', icon: CheckCircle, variant: 'eco' as const },
  cancelled: { label: 'Cancelled', icon: Clock, variant: 'destructive' as const }
};

const CustomRequests = () => {
  const { user } = useUserRole();
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    brief_text: '',
    budget: '',
    timeline_days: '',
    materials: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('custom_requests')
        .select(`
          *,
          seller:sellers(shop_name, verified_badge)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as CustomRequest[]);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async () => {
    if (!user || !newRequest.brief_text.trim()) return;

    try {
      const { error } = await supabase
        .from('custom_requests')
        .insert({
          buyer_id: user.id,
          brief_text: newRequest.brief_text,
          budget: newRequest.budget ? parseFloat(newRequest.budget) : null,
          timeline_days: newRequest.timeline_days ? parseInt(newRequest.timeline_days) : null,
          materials: newRequest.materials || null,
          ai_preview_notes: "AI will analyze your request and provide suggestions to artisans"
        });

      if (error) throw error;

      toast({
        title: "Custom request created!",
        description: "Artisans will review your request and send quotes.",
      });

      setNewRequest({
        brief_text: '',
        budget: '',
        timeline_days: '',
        materials: ''
      });
      setShowNewRequest(false);
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error creating request",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const acceptQuote = async (requestId: string) => {
    try {
      // Create order from custom request
      const request = requests.find(r => r.id === requestId);
      if (!request || !request.quote_amount) return;

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user!.id,
          seller_id: request.seller_id,
          items: [{
            product_id: null,
            title: 'Custom Order',
            quantity: 1,
            price: request.quote_amount
          }],
          subtotal: request.quote_amount,
          total: request.quote_amount,
          custom_request_id: requestId,
          status: 'placed'
        });

      if (orderError) throw orderError;

      // Update request status
      const { error: updateError } = await supabase
        .from('custom_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Quote accepted!",
        description: "Order has been created and artisan will start working on it.",
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error accepting quote",
        description: error.message,
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold">Custom Requests</h1>
            <p className="text-muted-foreground mt-1">
              Get personalized crafts made just for you
            </p>
          </div>

          <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
            <DialogTrigger asChild>
              <Button variant="cultural">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Custom Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="brief">Describe what you want</Label>
                  <Textarea
                    id="brief"
                    placeholder="I want a beautiful silver necklace with traditional Indian motifs, preferably with intricate filigree work. The design should be elegant and suitable for special occasions..."
                    value={newRequest.brief_text}
                    onChange={(e) => setNewRequest({...newRequest, brief_text: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="5000"
                      value={newRequest.budget}
                      onChange={(e) => setNewRequest({...newRequest, budget: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline (days)</Label>
                    <Input
                      id="timeline"
                      type="number"
                      placeholder="14"
                      value={newRequest.timeline_days}
                      onChange={(e) => setNewRequest({...newRequest, timeline_days: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="materials">Preferred Materials</Label>
                  <Input
                    id="materials"
                    placeholder="Silver, gold plating, pearls..."
                    value={newRequest.materials}
                    onChange={(e) => setNewRequest({...newRequest, materials: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-sm">AI will enhance your request and match you with suitable artisans</p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewRequest(false)}>
                    Cancel
                  </Button>
                  <Button variant="cultural" onClick={createRequest}>
                    Create Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-playfair font-semibold mb-2">No custom requests yet</h2>
            <p className="text-muted-foreground mb-6">
              Create a custom request to get personalized crafts made just for you
            </p>
            <Button variant="cultural" onClick={() => setShowNewRequest(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Request
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => {
              const StatusIcon = statusConfig[request.status].icon;
              return (
                <Card key={request.id} className="glass-card border-0 shadow-soft">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={statusConfig[request.status].variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[request.status].label}
                          </Badge>
                          {request.seller && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-muted-foreground">by</span>
                              <span className="text-sm font-medium">{request.seller.shop_name}</span>
                              {request.seller.verified_badge && (
                                <Badge variant="verified" className="text-xs">Verified</Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Request Details</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {request.brief_text}
                      </p>
                    </div>

                    <div className="flex gap-4 text-sm">
                      {request.budget && (
                        <div>
                          <span className="text-muted-foreground">Budget: </span>
                          <span className="font-medium">₹{request.budget.toLocaleString()}</span>
                        </div>
                      )}
                      {request.timeline_days && (
                        <div>
                          <span className="text-muted-foreground">Timeline: </span>
                          <span className="font-medium">{request.timeline_days} days</span>
                        </div>
                      )}
                      {request.materials && (
                        <div>
                          <span className="text-muted-foreground">Materials: </span>
                          <span className="font-medium">{request.materials}</span>
                        </div>
                      )}
                    </div>

                    {request.status === 'quoted' && request.quote_amount && (
                      <div className="p-4 rounded-lg border border-cultural/20 bg-cultural/5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Quote Received</h4>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ₹{request.quote_amount.toLocaleString()}
                            </p>
                            {request.quote_timeline_days && (
                              <p className="text-sm text-muted-foreground">
                                {request.quote_timeline_days} days
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Discuss
                          </Button>
                          <Button 
                            variant="cultural" 
                            size="sm"
                            onClick={() => acceptQuote(request.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Quote
                          </Button>
                        </div>
                      </div>
                    )}

                    {request.ai_preview_notes && (
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">AI Insights</p>
                            <p className="text-xs text-muted-foreground">{request.ai_preview_notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {(request.status === 'in_progress' || request.status === 'shipped') && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat with Artisan
                        </Button>
                        <Button variant="outline" size="sm">
                          View Progress
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomRequests;