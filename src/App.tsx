
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Search from '@/pages/Search';
import PremiumSubscription from '@/pages/PremiumSubscription';
import PremiumConfirmation from '@/pages/PremiumConfirmation';
import GameSearch from '@/pages/GameSearch';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/AdminDashboard';
import Games from '@/pages/admin/Games';
import Draws from '@/pages/admin/Draws';
import Countries from '@/pages/admin/Countries';
import LottoTypes from '@/pages/admin/LottoTypes';
import Users from '@/pages/admin/Users';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import SubscriptionPlans from './pages/admin/SubscriptionPlans';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/premium" element={<PremiumSubscription />} />
          <Route path="/premium-confirmation" element={<PremiumConfirmation />} />
          <Route path="/game-search/:id" element={<GameSearch />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/games" element={<Games />} />
          <Route path="/admin/draws" element={<Draws />} />
          <Route path="/admin/countries" element={<Countries />} />
          <Route path="/admin/lotto-types" element={<LottoTypes />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;
