import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContexType';

interface PrivateRouteProps {
  element: React.ReactElement; 
  requiredRole: 'teacher' | 'student';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
