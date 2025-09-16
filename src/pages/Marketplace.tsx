import * as React from "react";
import { StoryCard } from "@/components/storytelling/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart,
  Sparkles,
  Grid3X3,
  List,
  ShoppingBag
} from "lucide-react";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [wishlistedItems, setWishlistedItems] = React.useState<Set<string>>(new Set());
  
  const { products, loading, error, addToWishlist, removeFromWishlist, addToCart } = useProducts();
  const { user } = useUserRole();
  const { toast } = useToast();

  // Create filters based on actual product tags
  const allTags = products.flatMap(p => p.tags || []);
  const uniqueTags = [...new Set(allTags)];
  
  const filters = [
    { id: 'all', label: 'All Crafts', count: products.length },
    ...uniqueTags.slice(0, 6).map(tag => ({
      id: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1),
      count: products.filter(p => p.tags?.includes(tag)).length
    }))
  ];

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    const isCurrentlyWishlisted = wishlistedItems.has(productId);
    let success = false;

    if (isCurrentlyWishlisted) {
      success = await removeFromWishlist(productId, user.id);
      if (success) {
        setWishlistedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast({
          title: "Removed from wishlist",
          description: "Item removed from your wishlist."
        });
      }
    } else {
      success = await addToWishlist(productId, user.id);
      if (success) {
        setWishlistedItems(prev => new Set(prev).add(productId));
        toast({
          title: "Added to wishlist",
          description: "Item added to your wishlist."
        });
      }
    }

    if (!success) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    const success = await addToCart(productId, user.id, 1);
    if (success) {
      toast({
        title: "Added to cart",
        description: "Item added to your cart successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller?.shop_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      product.tags?.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-playfair font-bold mb-2">
                Artisan <span className="text-primary">Marketplace</span>
              </h1>
              <p className="text-muted-foreground">
                Discover authentic crafts with AI-powered stories from local artisans
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crafts, artisans, or regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="font-playfair font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedFilter === filter.id 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{filter.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {filter.count}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="font-playfair font-semibold mb-4">Regions</h3>
                <div className="space-y-2">
                  {['Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Kerala', 'Kashmir'].map(region => (
                    <button
                      key={region}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors flex items-center gap-2"
                    >
                      <MapPin className="h-3 w-3" />
                      {region}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {filteredProducts.length} crafts found
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* AI Recommendations */}
            <Card className="glass-card border-0 shadow-soft mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-playfair font-semibold">AI Recommendations</h3>
                    <p className="text-sm text-muted-foreground">Curated for your interests</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="cultural">Heritage Textiles</Badge>
                  <Badge variant="eco">Sustainable Crafts</Badge>
                  <Badge variant="verified">Master Artisans</Badge>
                  <Badge variant="ai">New AI Stories</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading beautiful crafts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Error loading products: {error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : filteredProducts.length === 0 && products.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No crafts available yet</h3>
                <p className="text-muted-foreground mb-6">
                  Artisans are still setting up their beautiful creations. Check back soon!
                </p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <StoryCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.photos?.[0] || ''}
                    artisan={product.seller?.shop_name || 'Unknown Artisan'}
                    region={product.seller?.region || 'Unknown Region'}
                    badges={[
                      ...(product.eco_badge ? ['eco' as const] : []),
                      ...(product.cultural_badge ? ['cultural' as const] : []),
                      ...(product.seller?.verified_badge ? ['verified' as const] : [])
                    ]}
                    hasStory={!!product.story_text}
                    hasAudio={!!product.story_audio_url}
                    isWishlisted={wishlistedItems.has(product.id)}
                    onToggleWishlist={() => handleToggleWishlist(product.id)}
                    onAddToCart={() => handleAddToCart(product.id)}
                    onPlayStory={() => console.log('Play story:', product.id)}
                    onViewDetails={() => console.log('View details:', product.id)}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Crafts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;