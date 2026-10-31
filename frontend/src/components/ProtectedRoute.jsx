import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check karein ki user authenticated hai ya nahi (token check kar rahe hain)
  const token = localStorage.getItem('access_token');

  // Agar token nahi hai, toh login page par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar token hai, toh jo route maanga hai use khol do
  return <Outlet />;
};

export default ProtectedRoute;