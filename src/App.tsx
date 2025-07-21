import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { oidcConfig } from "@/lib/oidcConfig";


// Public pages (no authentication required)
import PublicBooks from "./pages/PublicBooks";
import PublicShelves from "./pages/PublicShelves";
import Index from "./pages/Index";

// Protected pages (authentication required)
import Dashboard from "./pages/Dashboard";
import Shelves from "./pages/Shelves";
import Books from "./pages/Books";
import NotFound from "./pages/NotFound";
import BookDetails from "./pages/BookDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider {...oidcConfig}>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Smart root route - redirects based on authentication */}
              <Route path="/" element={<Index />} />
              
              {/* Public routes - accessible without authentication */}
              <Route path="/public-books" element={<PublicBooks />} />
              <Route path="/public-shelves" element={<PublicShelves />} />
              
              {/* Protected routes - require authentication */}
             
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/shelves" 
                element={
                  <ProtectedRoute>
                    <Shelves />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books" 
                element={
                  <ProtectedRoute>
                    <Books />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books/:id"
                element={
                  <ProtectedRoute>
                    <BookDetails/>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/search" 
                element={
                  <ProtectedRoute>
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-3xl font-bold mb-6">Recherche</h1>
                      <p className="text-muted-foreground">
                         ...
                      </p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
                      <p className="text-muted-foreground">
                        Paramètres d'administration (accès admin requis)...
                      </p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
