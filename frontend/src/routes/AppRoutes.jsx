import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import UserManagement from '../pages/admin/UserManagement';
import AdminCommentPages from '../pages/admin/AdminCommentPages';
import AdminCommentList from '../pages/admin/AdminCommentList';
import AdminAllCommentHistories from '../pages/admin/AdminAllCommentHistories';

import Login from '../pages/user/Login';
import RequestOTP from '../pages/user/RequestOTP';
import VerifyOTP from '../pages/user/VerifyOtp';
import ResetPassword from '../pages/user/ResetPassword';
import UserDashboard from '../pages/user/UserDashboard';
import UserProtectedRoute from '../components/UserProtectedRoute';
import UserProfile from '../pages/user/UserProfile';
import CommentsPage from '../pages/user/CommentsPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Routes */}
        <Route path="/adminpanel/login" element={<AdminLogin />} />
        <Route
          path="/adminpanel/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/adminpanel/users" element={<UserManagement />} />
        <Route path="/adminpanel/comments" element={<AdminCommentPages />} />
        <Route path="/adminpanel/comments/:pageLabel" element={<AdminCommentList />} />
        <Route path="/adminpanel/all-comment-histories" element={<AdminAllCommentHistories />} />

        {/* User Routes */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/request-otp" element={<RequestOTP />} />
        <Route path="/user/verify-otp" element={<VerifyOTP />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/page/:page_key" element={<CommentsPage />} />

        <Route
          path="/user/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/user/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
