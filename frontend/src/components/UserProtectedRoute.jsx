import React from 'react';
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  return token ? children : <Navigate to="/user/login" replace />;
};

export default UserProtectedRoute;
