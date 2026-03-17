import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './components/UserLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import RoutinesPage from './pages/RoutinesPage';
import RoutineFormPage from './pages/RoutineFormPage';
import RoutineDetailPage from './pages/RoutineDetailPage';
import WorkoutPage from './pages/WorkoutPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import MeasurementsPage from './pages/MeasurementsPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes directly rendering full layout except Workout (needs space) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <HomePage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/routines" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <RoutinesPage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/routines/new" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <RoutineFormPage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/routines/:id/edit" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <RoutineFormPage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/routines/:id" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <RoutineDetailPage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/stats" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <StatsPage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Workout view usually doesn't need bottom nav and needs mostly full screen space */}
      <Route 
        path="/workout/:id/:dayId?" 
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <main className="app-content" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="container">
                  <WorkoutPage />
                </div>
              </main>
            </div>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/measurements" 
        element={
          <ProtectedRoute>
            <UserLayout>
              <MeasurementsPage />
            </UserLayout>
          </ProtectedRoute>
        } 
      />

      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
