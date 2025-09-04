import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { useUserRole } from "@/hooks/useUserRole";

// Pages
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import BuyerHome from "./pages/buyer/BuyerHome";
import SellerDashboard from "./pages/seller/SellerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, switchRole } = useUserRole();

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
        <Route path="/market" element={<Marketplace />} />
        <Route path="/buyer" element={<BuyerHome />} />
        <Route path="/seller" element={<SellerDashboard />} />
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
