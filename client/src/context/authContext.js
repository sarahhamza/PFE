import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a new context for authentication
export const AuthContext = createContext();

// AuthProvider component to wrap around the application
export const AuthProvider = ({ children }) => {
  // State to manage authentication status
  const [authenticated, setAuthenticated] = useState(false);

  // Effect to check authentication status on mount
  useEffect(() => {
    // Your authentication logic goes here
    // For example, you might check if the user is logged in based on a token in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  // Function to handle login
  const login = () => {
    // Your login logic goes here
    // For example, you might authenticate the user with a server and store a token in local storage
    localStorage.setItem('token', 'your-auth-token');
    setAuthenticated(true);
  };

  // Function to handle logout
  const logout = () => {
    // Your logout logic goes here
    // For example, you might remove the token from local storage and update the authentication state
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  // Provide the authentication state and functions to children components
  //const useAuth = () => useContext(AuthContext);

  // Export AuthContext and AuthProvider
  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth function
export const useAuth = () => useContext(AuthContext);
