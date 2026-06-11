import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './features/auth/AuthProvider';
import { usePropertyStore } from './store/propertyStore';

const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const MyBookings = lazy(() => import('./features/profile/MyBookings'));
const AdminLogin = lazy(() => import('./features/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard'));
const LeadsPage = lazy(() => import('./features/admin/LeadsPage'));
const BookingsPage = lazy(() => import('./features/admin/BookingsPage'));
const AdminSettings = lazy(() => import('./features/admin/AdminSettings'));
const MessagesPage = lazy(() => import('./features/admin/MessagesPage'));
const Forbidden = lazy(() => import('./pages/Forbidden'));

import AuthGuard from './features/auth/AuthGuard';
import AdminGuard from './features/auth/AdminGuard';

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const fetchProperties = usePropertyStore((s) => s.fetchProperties);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
              <Route path="/profile/favorites" element={<AuthGuard><FavoritesPage /></AuthGuard>} />
              <Route path="/profile/bookings" element={<AuthGuard><MyBookings /></AuthGuard>} />

              <Route path="/secure-portal" element={<AdminLogin />} />
              <Route path="/secure-portal/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/secure-portal/leads" element={<AdminGuard><LeadsPage /></AdminGuard>} />
              <Route path="/secure-portal/bookings" element={<AdminGuard><BookingsPage /></AdminGuard>} />
              <Route path="/secure-portal/messages" element={<AdminGuard><MessagesPage /></AdminGuard>} />
              <Route path="/secure-portal/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />

              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="*" element={<Forbidden />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
