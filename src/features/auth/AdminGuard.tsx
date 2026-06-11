import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);

  if (!isLoggedIn) return <Navigate to="/secure-portal" replace />;
  if (user?.role !== 'admin') return <Navigate to="/forbidden" replace />;

  return <>{children}</>;
}
