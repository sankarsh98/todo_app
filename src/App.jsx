// Main App Component
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { GamificationProvider } from './context/GamificationContext';

// Components
import AuthPage from './components/Auth/AuthPage';
import Sidebar from './components/Layout/Sidebar';
import MobileNav from './components/Layout/MobileNav';
import GamificationNotifications from './components/Gamification/GamificationNotifications';

// Views
import MyDay from './views/MyDay';
import Important from './views/Important';
import Upcoming from './views/Upcoming';
import AllTasks from './views/AllTasks';
import Completed from './views/Completed';
import LabelView from './views/LabelView';
import Labels from './views/Labels';
import Summary from './views/Summary';
import Calendar from './views/Calendar';
import FeatureRequest from './views/FeatureRequest';

// Loading Spinner
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-spinner"></div>
    <p>Loading TaskFlow...</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App Layout with Sidebar
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <TaskProvider>
      <GamificationProvider>
        <div className="app-container">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />

          <main className={`main-content ${!sidebarOpen && !isMobile ? 'sidebar-collapsed' : ''}`}>
            {/* Mobile Header */}
            {isMobile && (
              <header className="mobile-header">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
                <div className="mobile-header-logo">
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="10" fill="url(#mobile-logo-gradient)" />
                    <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="mobile-logo-gradient" x1="0" y1="0" x2="48" y2="48">
                        <stop stopColor="#6366f1" />
                        <stop offset="1" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>TaskFlow</span>
                </div>
              </header>
            )}

            <div className="page-content">
              <Routes>
                <Route path="/" element={<MyDay />} />
                <Route path="/important" element={<Important />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="/all" element={<AllTasks />} />
                <Route path="/completed" element={<Completed />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/feedback" element={<FeatureRequest />} />
                <Route path="/labels" element={<Labels />} />
                <Route path="/label/:labelId" element={<LabelView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>

          {isMobile && <MobileNav onMenuClick={toggleSidebar} />}
          <GamificationNotifications />
        </div>
      </GamificationProvider>
    </TaskProvider>
  );
};

// Main App
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Routes based on auth state
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
