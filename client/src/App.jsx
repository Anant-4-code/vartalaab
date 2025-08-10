import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatApp from './components/ChatApp';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import './App.css';

// Modified ProtectedRoute to bypass authentication temporarily
const ProtectedRoute = ({ children }) => {
  // Bypass authentication check
  return children;
};

// PublicRoute component to redirect authenticated users away from auth pages
const PublicRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      try {
        const username = localStorage.getItem('username');
        if (username) {
          setIsAuthenticated(true);
          navigate('/chat');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : null;
};

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
  };

  // Skip loading state for now

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
            <Route 
              path="/" 
              element={
                <LandingPage 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode} 
                />
              } 
            />
            <Route 
              path="/auth" 
              element={
                <Navigate to="/chat" replace />
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ChatApp darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
    </Router>
  );
}

export default App;
