import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AlumniList from './pages/AlumniList';
import Bidding from './pages/Bidding';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { getProfile, logout } from './lib/api';
import { Skeleton } from './components/ui/skeleton';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await getProfile();
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex">
        <Sidebar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        <main className="main-content" style={{ width: '100%' }}>
          <Routes>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />
            } />
            
            {/* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alumni" element={<AlumniList />} />
                <Route path="/bidding" element={<Bidding />} />
                <Route path="/settings" element={<Settings />} />
              </>
            ) : (
              // Redirect everything else to login when not authenticated
              <Route path="*" element={<Navigate to="/login" />} />
            )}
            
            {/* Catch-all redirect to Dashboard if authenticated */}
            {isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
