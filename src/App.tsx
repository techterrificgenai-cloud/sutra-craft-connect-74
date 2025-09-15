import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { useUserRole } from "@/hooks/useUserRole";

// Pages
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import Auth from "./pages/Auth";
import BuyerHome from "./pages/buyer/BuyerHome";
import Cart from "./pages/buyer/Cart";
import Wishlist from "./pages/buyer/Wishlist";
import Rewards from "./pages/buyer/Rewards";
import CustomRequests from "./pages/buyer/CustomRequests";
import SellerDashboard from "./pages/seller/SellerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true }: { children: React.ReactNode; requireAuth?: boolean }) => {
  const { isAuthenticated, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user, switchRole, isAuthenticated } = useUserRole();

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userRole={user?.role || null}
        cartItemCount={3}
        wishlistCount={5}
        onRoleSwitch={switchRole}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/market" element={<Marketplace />} />
        
        {/* Buyer Routes */}
        <Route path="/buyer" element={
          <ProtectedRoute>
            <BuyerHome />
          </ProtectedRoute>
        } />
        <Route path="/buyer/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/buyer/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
        <Route path="/buyer/rewards" element={
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        } />
        <Route path="/buyer/custom-requests" element={
          <ProtectedRoute>
            <CustomRequests />
          </ProtectedRoute>
        } />
        
        {/* Seller Routes */}
        <Route path="/seller" element={
          <ProtectedRoute>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect authenticated users from auth page */}
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to={user?.role === 'seller' ? '/seller' : '/buyer'} replace /> : <Auth />
        } />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
