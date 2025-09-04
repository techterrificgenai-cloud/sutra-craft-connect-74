import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoiceButton } from "@/components/ui/voice-button";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  artisan: string;
  region: string;
  badges?: readonly ('eco' | 'cultural' | 'verified')[];
  hasStory?: boolean;
  hasAudio?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  onAddToCart?: () => void;
  onPlayStory?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

const StoryCard = React.forwardRef<HTMLDivElement, StoryCardProps>(
  ({
    id,
    title,
    price,
    image,
    artisan,
    region,
    badges = [],
    hasStory = false,
    hasAudio = false,
    isWishlisted = false,
    onToggleWishlist,
    onAddToCart,
    onPlayStory,
    onViewDetails,
    className,
    ...props
  }, ref) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handlePlayStory = () => {
      setIsPlaying(true);
      onPlayStory?.();
      // Mock audio duration
      setTimeout(() => setIsPlaying(false), 3000);
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "group cursor-pointer overflow-hidden border-0 shadow-soft hover:shadow-cultural transition-all duration-300 hover:-translate-y-1 glass-card",
          className
        )}
        onClick={onViewDetails}
        {...props}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {badges.map((badge) => (
              <Badge key={badge} variant={badge} className="text-xs">
                {badge === 'eco' && '🌱 Eco'}
                {badge === 'cultural' && '🎨 Cultural'}
                {badge === 'verified' && '✓ Verified'}
              </Badge>
            ))}
          </div>

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.();
            }}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWishlisted ? "fill-primary text-primary" : "text-white"
              )}
            />
          </Button>

          {/* Story controls */}
          {hasStory && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              {hasAudio && (
                <VoiceButton
                  variant="play"
                  isPlaying={isPlaying}
                  onPlayAudio={handlePlayStory}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <Badge variant="ai" className="text-xs animate-glow">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Story
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-playfair font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-lg font-bold text-primary">
                ₹{price.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>by {artisan}</p>
              <p>{region}</p>
            </div>

            <Button
              variant="cultural"
              size="sm"
              className="w-full mt-3"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

StoryCard.displayName = "StoryCard";

export { StoryCard };