import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Ratings from "./pages/Ratings";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const AppWithAuth = () => {
  const authProvider = useAuthProvider();
  
  return (
    <AuthContext.Provider value={authProvider}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/ratings" component={Ratings} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithAuth />
    </QueryClientProvider>
  );
};

export default App;
