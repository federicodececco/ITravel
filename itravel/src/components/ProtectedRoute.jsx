import { Navigate, useLocation } from 'react-router';
import { UserAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireProfile = false }) {
  const { session, profile, loading, setLoading, isAuthenticated } = UserAuth();
  const location = useLocation();
  console.log(isAuthenticated);
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (isAuthenticated) {
    return children;
  }
}
