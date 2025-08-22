import { Navigate, useLocation } from 'react-router';
import { UserAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireProfile = false }) {
  const { session, profile, loading, setLoading, isAuthenticated } = UserAuth();
  const location = useLocation();
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (isAuthenticated) {
    return children;
  }
}
