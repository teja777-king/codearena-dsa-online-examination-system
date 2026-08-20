import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import { LoadingSpinner } from './components/common/Badge';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { ForgotPassword, ResetPassword } from './pages/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import SyllabusPage from './pages/SyllabusPage';
import PracticePage from './pages/PracticePage';
import ExamsListPage from './pages/ExamsListPage';
import ExamTakingPage from './pages/ExamTakingPage';
import ExamResultPage from './pages/ExamResultPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import VisualizerPage from './pages/VisualizerPage';
import AlgorithmLibraryPage from './pages/AlgorithmLibraryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuestionsPage from './pages/AdminQuestionsPage';
import AdminExamsPage from './pages/AdminExamsPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminAttemptsListPage from './pages/AdminAttemptsListPage';
import AdminAttemptDetailPage from './pages/AdminAttemptDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'faculty') return <Navigate to="/admin/questions" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main Layout Wrapper
const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide sidebar on landing page, auth pages, and exam taking page
  const isPublicPage = ['/', '/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isTakeExamPage = location.pathname.includes('/take');
  const showSidebar = isAuthenticated && !isPublicPage && !isTakeExamPage;

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      {!isTakeExamPage && (
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      )}

      <div className="flex-1 flex">
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'lg:pl-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/visualizer" element={<VisualizerPage />} />
            <Route path="/algorithms" element={<AlgorithmLibraryPage />} />
            <Route path="/syllabus" element={<SyllabusPage />} />

            {/* Student Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <PracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <ExamsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/:id/take"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <ExamTakingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/result/:attemptId"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <ExamResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin & Faculty Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <AdminQuestionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <AdminExamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attempts"
              element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <AdminAttemptsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attempt/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <AdminAttemptDetailPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
