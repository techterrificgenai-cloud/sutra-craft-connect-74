import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Heart, 
  Globe, 
  Users, 
  Mic, 
  Palette,
  ArrowRight,
  Star
} from "lucide-react";

const Landing = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState('English');
  
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Stories",
      description: "Every craft tells a story. Our AI helps artisans share their heritage through compelling narratives and voice."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect local artisans with worldwide customers through intelligent translation and marketing."
    },
    {
      icon: Heart,
      title: "Cultural Preservation",
      description: "Preserve traditional crafts and techniques for future generations through digital storytelling."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Build lasting relationships between artisans and customers through customization and direct communication."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Textile Artisan",
      location: "Rajasthan",
      quote: "Sutradhar helped me reach customers across India. The AI stories brought my heritage to life!",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Art Collector",
      location: "Singapore",
      quote: "I love hearing the stories behind each piece. The customization process was seamless.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="ai" className="mb-6 animate-glow">
              <Sparkles className="h-3 w-3 mr-1" />
              Where Tradition Meets AI
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
              Empower Local{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent animate-glow">
                Artisans
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Connect traditional craftsmanship with modern technology. AI-powered stories, 
              global reach, and meaningful customization for artisans and collectors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="hero" size="lg" className="group">
                <Link to="/market">
                  <Palette className="h-5 w-5 mr-2" />
                  Explore Crafts
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild variant="accent" size="lg" className="group">
                <Link to="/seller">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Sell Your Craft
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="text-sm">Voice-First Experience</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Multiple Languages</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="text-sm">Cultural Authenticity</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center">
            <Palette className="h-8 w-8 text-accent-glow" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary-glow" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Bridging <span className="text-primary">Heritage</span> & <span className="text-accent">Innovation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform helps artisans share their stories, reach global markets, 
              and preserve cultural traditions for future generations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group glass-card border-0 shadow-soft hover:shadow-cultural transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-cultural flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-playfair font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Stories from Our <span className="text-primary">Community</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Hear from artisans and collectors who've found success on Sutradhar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card border-0 shadow-soft hover:shadow-cultural transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-cultural flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-cultural">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-playfair font-bold text-primary-foreground mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of artisans and collectors who are preserving heritage through technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/market">Start Exploring</Link>
              </Button>
              <Button asChild variant="accent" size="lg">
                <Link to="/seller">Become a Seller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;