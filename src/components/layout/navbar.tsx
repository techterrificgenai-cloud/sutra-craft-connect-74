import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingCart, 
  User, 
  Search, 
  Globe,
  Sparkles,
  Store,
  BarChart3
} from "lucide-react";

interface NavbarProps {
  userRole?: 'buyer' | 'seller' | 'admin' | null;
  cartItemCount?: number;
  wishlistCount?: number;
  onRoleSwitch?: (role: 'buyer' | 'seller') => void;
}

const Navbar = ({ userRole, cartItemCount = 0, wishlistCount = 0, onRoleSwitch }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-full bg-gradient-cultural flex items-center justify-center shadow-cultural group-hover:shadow-glow transition-all duration-300">
            <Sparkles className="h-5 w-5 text-primary-foreground animate-glow" />
          </div>
          <div>
            <h1 className="text-xl font-playfair font-bold bg-gradient-cultural bg-clip-text text-transparent">
              Sutradhar
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">AI Marketplace</p>
          </div>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/market" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/market') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Marketplace
          </Link>
          
          {userRole === 'buyer' && (
            <>
              <Link 
                to="/buyer" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/buyer') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                My Home
              </Link>
              <Link 
                to="/buyer/rewards" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/buyer/rewards') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Rewards
              </Link>
            </>
          )}

          {userRole === 'seller' && (
            <>
              <Link 
                to="/seller" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/seller') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/seller/ai" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/seller/ai') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                AI Studio
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Role Switch (Demo) */}
          <div className="hidden md:flex items-center space-x-2 mr-4">
            <Button
              variant={userRole === 'buyer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleSwitch?.('buyer')}
              className="h-8"
            >
              <User className="h-3 w-3 mr-1" />
              Buyer
            </Button>
            <Button
              variant={userRole === 'seller' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleSwitch?.('seller')}
              className="h-8"
            >
              <Store className="h-3 w-3 mr-1" />
              Seller
            </Button>
          </div>

          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Language */}
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Globe className="h-4 w-4" />
          </Button>

          {/* Buyer Actions */}
          {userRole === 'buyer' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative"
              >
                <Link to="/buyer/wishlist">
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative"
              >
                <Link to="/buyer/cart">
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="primary" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </>
          )}

          {/* Seller Actions */}
          {userRole === 'seller' && (
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to="/seller/trends">
                <BarChart3 className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* Profile */}
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };