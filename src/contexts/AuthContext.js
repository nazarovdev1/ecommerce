import React, { createContext, useContext, useState, useEffect } from 'react';

// Simple hash function for demo purposes (in production, use proper hashing)
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Admin credentials (in production, this should be server-side)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD_HASH = hashPassword('admin123'); // Hash of 'admin123'

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (authData.isAuthenticated && authData.timestamp) {
        // Check if session is still valid (24 hours)
        const now = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        if (now - authData.timestamp < sessionDuration) {
          setIsAuthenticated(true);
          setUser({ username: authData.username });
        } else {
          // Session expired
          localStorage.removeItem('admin_auth');
        }
      }
    }
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && hashPassword(password) === ADMIN_PASSWORD_HASH) {
      const authData = {
        isAuthenticated: true,
        username: username,
        timestamp: Date.now()
      };
      localStorage.setItem('admin_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser({ username });
      return { success: true };
    }
    return { success: false, error: 'Noto\'g\'ri login yoki parol' };
  };

  const logout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
