import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Store/FirebaseAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, role } = useAuth(); //`role` is available from `useAuth()`

  // Check if the user is logged in
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Check if the user has the required role or is a superAdmin
  if (
    requiredRole && 
    role.toLowerCase() !== requiredRole.toLowerCase() && 
    role.toLowerCase() !== 'superadmin'
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
