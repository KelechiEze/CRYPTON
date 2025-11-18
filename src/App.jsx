import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Preloader from './components/Preloader';
import AuthLayout from './pages/auth/AuthLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Wallets from './pages/dashboard/Wallets';
import Transactions from './pages/dashboard/Transactions';
import Settings from './pages/dashboard/Settings';
import Profile from './pages/dashboard/Profiles';
import Mine from './pages/dashboard/Mine';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext'; // Add this import
import TawkToChat from './components/TawkToChat';
import CustomerCareButton from './components/CustomerCareButton';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const savedAuth = authStatus === 'true';
      
      setIsAuthenticated(savedAuth);
      
      const timer = setTimeout(() => {
        setLoading(false);
        
        if (!savedAuth) {
          if (!['/login', '/signup', '/forgot-password'].includes(location.pathname)) {
            navigate('/signup');
          }
        } else {
          if (['/login', '/signup', '/forgot-password', '/'].includes(location.pathname)) {
            navigate('/dashboard/overview');
          }
        }
      }, 2000);

      return () => clearTimeout(timer);
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !['/login', '/signup', '/forgot-password'].includes(location.pathname)) {
        navigate('/signup');
      } else if (isAuthenticated && ['/login', '/signup', '/forgot-password', '/'].includes(location.pathname)) {
        navigate('/dashboard/overview');
      }
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard/overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider> {/* Wrap with LanguageProvider */}
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
          <Routes>
            {isAuthenticated ? (
              <Route path="/dashboard" element={<DashboardLayout handleLogout={handleLogout} />}>
                <Route path="overview" element={<Overview />} />
                <Route path="wallets" element={<Wallets />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="mine" element={<Mine />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route index element={<Overview />} />
              </Route>
            ) : (
              <Route path="/" element={<AuthLayout />}>
                <Route path="signup" element={<Signup onSignup={handleLogin} />} />
                <Route path="login" element={<Login onLogin={handleLogin} />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route index element={<Signup onSignup={handleLogin} />} />
              </Route>
            )}
            <Route path="*" element={isAuthenticated ? <Overview /> : <Signup onSignup={handleLogin} />} />
          </Routes>

          {isAuthenticated && (
            <>
              <TawkToChat />
              <CustomerCareButton />
            </>
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;