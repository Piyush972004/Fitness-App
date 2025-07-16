
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect based on authentication status
  return <Navigate to={isAuthenticated ? "/" : "/auth"} replace />;
};

export default Index;
