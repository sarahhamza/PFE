// AuthenticatedRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ isAuthenticated, ...props }) => {
  return isAuthenticated ? <Route {...props} /> : <Navigate to="/login" replace />;
};

export default AuthenticatedRoute;