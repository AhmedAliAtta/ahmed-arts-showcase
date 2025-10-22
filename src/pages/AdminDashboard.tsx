import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import PortfolioManager from '@/components/admin/PortfolioManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import MessagesManager from '@/components/admin/MessagesManager';
import ProfileManager from '@/components/admin/ProfileManager';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/portfolio" replace />} />
        <Route path="/portfolio" element={<PortfolioManager />} />
        <Route path="/testimonials" element={<TestimonialsManager />} />
        <Route path="/messages" element={<MessagesManager />} />
        <Route path="/profile" element={<ProfileManager />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
