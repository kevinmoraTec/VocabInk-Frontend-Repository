import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import WordsPage from "./pages/WordsPage";
import GeneratePostPage from "./pages/GeneratePostPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";

const queryClient = new QueryClient();

// Hook to verify auth state via API (cookie-based)
function useAuthVerification() {
  const { verifyAuth, isLoading } = useAuthStore();

  useEffect(() => {
    // Verify auth on mount by calling the backend API
    // The backend will check the HTTP-only cookie
    verifyAuth();
  }, [verifyAuth]);

  return { isLoading };
}

// Route that requires authentication AND completed onboarding
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  // Show nothing while verifying auth
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

// Route that only requires authentication (for onboarding page)
function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  // Show nothing while verifying auth
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user already completed onboarding, redirect to dashboard
  if (user.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Route that redirects logged-in users away from login page
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  // Show nothing while verifying auth
  if (isLoading) {
    return null;
  }
  
  if (isAuthenticated && user) {
    // Redirect to appropriate page based on onboarding status
    if (user.onboardingCompleted) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }
  
  return <>{children}</>;
}

// Loading component while verifying auth
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Component that verifies auth on mount
function AppRoutes() {
  const { isLoading } = useAuthVerification();

  // Show loading screen while verifying auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/onboarding" element={<AuthenticatedRoute><OnboardingPage /></AuthenticatedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/words" element={<ProtectedRoute><WordsPage /></ProtectedRoute>} />
      <Route path="/generate-post" element={<ProtectedRoute><GeneratePostPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
        <FeedbackWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
