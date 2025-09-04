import * as React from "react";
import { StoryCard } from "@/components/storytelling/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart,
  Sparkles,
  Grid3X3,
  List
} from "lucide-react";

// Import generated images
import banarasiSaree from "@/assets/banarasi-saree.jpg";
import bluePottery from "@/assets/blue-pottery.jpg";
import silverFiligree from "@/assets/silver-filigree.jpg";
import madhubaniPainting from "@/assets/madhubani-painting.jpg";
import pashmineShawl from "@/assets/pashmina-shawl.jpg";
import terracottaPlanters from "@/assets/terracotta-planters.jpg";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [wishlistedItems, setWishlistedItems] = React.useState<Set<string>>(new Set());

  // Mock data - in real app this would come from Firebase
  const products = [
    {
      id: "1",
      title: "Handwoven Banarasi Silk Saree",
      price: 15000,
      image: banarasiSaree,
      artisan: "Meera Devi",
      region: "Varanasi, UP",
      badges: ['cultural', 'verified'] as const,
      hasStory: true,
      hasAudio: true,
      story: "This saree carries the legacy of 500-year-old weaving traditions..."
    },
    {
      id: "2", 
      title: "Blue Pottery Ceramic Bowl Set",
      price: 2500,
      image: bluePottery,
      artisan: "Rajesh Kumar",
      region: "Jaipur, RJ",
      badges: ['eco', 'cultural'] as const,
      hasStory: true,
      hasAudio: true,
      story: "Crafted using traditional techniques passed down through generations..."
    },
    {
      id: "3",
      title: "Silver Filigree Jewelry Box",
      price: 8500,
      image: silverFiligree,
      artisan: "Lakshmi Nayak",
      region: "Cuttack, OR",
      badges: ['verified'] as const,
      hasStory: true,
      hasAudio: false,
      story: "Each delicate wire is shaped by hand in an art form dating back to Mughal era..."
    },
    {
      id: "4",
      title: "Madhubani Painting Canvas",
      price: 3200,
      image: madhubaniPainting,
      artisan: "Sita Mishra",
      region: "Mithila, BR",
      badges: ['cultural', 'eco'] as const,
      hasStory: true,
      hasAudio: true,
      story: "Natural pigments and traditional motifs tell stories of ancient folklore..."
    },
    {
      id: "5",
      title: "Pashmina Wool Shawl",
      price: 12000,
      image: pashmineShawl,
      artisan: "Mohammad Ali",
      region: "Kashmir, JK",
      badges: ['eco', 'verified'] as const,
      hasStory: true,
      hasAudio: true,
      story: "From the highlands of Kashmir, each thread spun with generations of expertise..."
    },
    {
      id: "6",
      title: "Terracotta Garden Planter Set",
      price: 1800,
      image: terracottaPlanters,
      artisan: "Ganga Kumhar",
      region: "Khurja, UP",
      badges: ['eco'] as const,
      hasStory: true,
      hasAudio: false,
      story: "Made from locally sourced clay, these planters bring earthen beauty to your space..."
    }
  ];

  const filters = [
    { id: 'all', label: 'All Crafts', count: products.length },
    { id: 'textiles', label: 'Textiles', count: 2 },
    { id: 'pottery', label: 'Pottery', count: 2 },
    { id: 'jewelry', label: 'Jewelry', count: 1 },
    { id: 'paintings', label: 'Art & Paintings', count: 1 }
  ];

  const handleToggleWishlist = (productId: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.artisan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <StoryCard
                  key={product.id}
                  {...product}
                  isWishlisted={wishlistedItems.has(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product.id)}
                  onAddToCart={() => console.log('Add to cart:', product.id)}
                  onPlayStory={() => console.log('Play story:', product.id)}
                  onViewDetails={() => console.log('View details:', product.id)}
                />
              ))}
            </div>

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