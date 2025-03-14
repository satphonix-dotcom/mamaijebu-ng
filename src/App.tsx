
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/admin/Games";
import Draws from "./pages/admin/Draws";
import Countries from "./pages/admin/Countries";
import LottoTypes from "./pages/admin/LottoTypes";
import Users from "./pages/admin/Users";
import AdminDashboard from "./pages/admin/Dashboard";
import Search from "./pages/Search";
import GameSearch from "./pages/GameSearch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/games" element={<GameSearch />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/games" element={<Games />} />
            <Route path="/admin/draws" element={<Draws />} />
            <Route path="/admin/countries" element={<Countries />} />
            <Route path="/admin/lotto-types" element={<LottoTypes />} />
            <Route path="/admin/users" element={<Users />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
