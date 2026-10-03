import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'user_demo_123',
    name: 'Nikunj Sharma',
    email: 'demo@lifehub.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });
  const [token, setToken] = useState(localStorage.getItem('lifehub_token') || 'demo-token-lifehub');
  const [storageMode, setStorageMode] = useState('Checking...');

  useEffect(() => {
    // Check API status & storage mode
    fetch('/api/status')
      .then(r => r.json())
      .then(data => setStorageMode(data.storageMode || 'Mock Storage'))
      .catch(() => setStorageMode('Mock Fallback Storage'));
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('lifehub_token', newToken);
  };

  const logout = () => {
    setToken('demo-token-lifehub');
    setUser({
      id: 'user_demo_123',
      name: 'Demo Guest',
      email: 'demo@lifehub.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
    localStorage.removeItem('lifehub_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, storageMode, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
