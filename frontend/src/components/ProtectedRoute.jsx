import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === 'loading') return <p className="text-sm text-gray-500">Loading...</p>;
  if (status === 'unauthenticated') return <Navigate to="/auth/signin" replace />;
  return <Outlet />;
}
