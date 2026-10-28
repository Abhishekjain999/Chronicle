import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PostDetailsPage from './pages/PostDetailsPage';
import WritePostPage from './pages/WritePostPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="posts/:slug" element={<PostDetailsPage />} />
              <Route path="users/:id" element={<UserProfilePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              {/* Protected Author Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="write" element={<WritePostPage />} />
                <Route path="edit/:id" element={<WritePostPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>

        {/* Global Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1c1917',
              color: '#f5f5f4',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
