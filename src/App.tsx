import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Using alias for sonner
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Page Imports
import AuthenticationPage from "./pages/AuthenticationPage";
import DashboardPage from "./pages/DashboardPage";
import TradingPage from "./pages/TradingPage";
import WalletPage from "./pages/WalletPage";
import OrdersPage from "./pages/OrdersPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

// Mock authentication state - in a real app, this would come from context/store
const isAuthenticated = () => {
  // For this example, let's assume if a user has navigated away from /auth, they are "logged in"
  // This is a very simple mock. A real app would use tokens, context, etc.
  // Or, for now, we can just manually set it for testing purposes.
  // To test protected routes, you might initially return false, then true after "login".
  // For page generation, we want routes to be accessible.
  return true; // Or some logic to check actual auth status
};

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    // Redirect them to the /auth page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth" replace />;
  }
  return children;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" /> {/* Configure Sonner globally */}
      <BrowserRouter>
        <Routes>
          {/* Authentication Page - Public */}
          <Route path="/auth" element={<AuthenticationPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trading" 
            element={
              <ProtectedRoute>
                <TradingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wallet" 
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Index route: Redirect to /auth if not authenticated, else /dashboard */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
            } 
          />

          {/* Catch-all NotFound Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;