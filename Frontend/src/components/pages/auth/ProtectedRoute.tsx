// src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../../store/useUserStore';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useUserStore();

  // 1. While the user's status is loading, show a loading message.
  if (loading) {
    return <div>Loading, please wait...</div>;
  }

  // 2. If the user is authenticated, allow access to the page.
  // The <Outlet /> component renders the actual page content (e.g., the Chat or Dashboard).
  if (isAuthenticated) {
    return <Outlet />;
  }

  // 3. If the user is not authenticated, redirect them to the Sign In page.
  return <Navigate to="/SignIn" />;
};