import React, { createContext, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //null = not logged in

  
  const login = (email) => {
    setUser({
      id: '1',
      email: email,
      name: email.split('@')[0], // Simple name from email
    });
  };

  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};