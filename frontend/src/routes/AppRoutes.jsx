import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin pages
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import AdminCommentPages from '../pages/admin/AdminCommentPages';
import AdminCommentList from '../pages/admin/AdminCommentList';
import AdminAllCommentHistories from '../pages/admin/AdminAllCommentHistories';

// User pages
import Login from '../pages/user/Login';
import RequestOTP from '../pages/user/RequestOTP';
import VerifyOTP from '../pages/user/VerifyOtp';
import ResetPassword from '../pages/user/ResetPassword';
import UserDashboard from '../pages/user/UserDashboard';
import UserProfile from '../pages/user/UserProfile';
import CommentsPage from '../pages/user/CommentsPage';

// Route guards
import ProtectedRoute from '../components/ProtectedRoute';
import UserProtectedRoute from '../components/UserProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Public Admin Route */}
        <Route path="/adminpanel/login" element={<AdminLogin />} />

        {/* ✅ Protected Admin Routes */}
        <Route
          path="/adminpanel/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminpanel/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminpanel/comments"
          element={
            <ProtectedRoute>
              <AdminCommentPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminpanel/comments/:pageLabel"
          element={
            <ProtectedRoute>
              <AdminCommentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminpanel/all-comment-histories"
          element={
            <ProtectedRoute>
              <AdminAllCommentHistories />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public User Routes */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/request-otp" element={<RequestOTP />} />
        <Route path="/user/verify-otp" element={<VerifyOTP />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />

        {/* ✅ Protected User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user/page/:page_key"
          element={
            <UserProtectedRoute>
              <CommentsPage />
            </UserProtectedRoute>
          }
        />

        {/* ✅ Default Redirect */}
        <Route path="*" element={<Navigate to="/user/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
