import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { status, user } = useAuth();

  if (status === 'loading') return <p className="text-sm text-gray-500">Loading...</p>;
  if (status === 'unauthenticated') return <Navigate to="/auth/signin" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
