import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GameSearch from './pages/GameSearch';
import AdminDashboard from './pages/admin/AdminDashboard';
import Games from './pages/admin/Games';
import Draws from './pages/admin/Draws';
import LottoTypes from './pages/admin/LottoTypes';
import Countries from './pages/admin/Countries';
import Users from './pages/admin/Users';
import NotFound from './pages/NotFound';
import PremiumSubscription from './pages/PremiumSubscription';
import PremiumConfirmation from './pages/PremiumConfirmation';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/premium" element={<PremiumSubscription />} />
          <Route path="/premium-confirmation" element={<PremiumConfirmation />} />
          <Route path="/search" element={<GameSearch />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/games" element={<Games />} />
          <Route path="/admin/draws" element={<Draws />} />
          <Route path="/admin/lotto-types" element={<LottoTypes />} />
          <Route path="/admin/countries" element={<Countries />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
