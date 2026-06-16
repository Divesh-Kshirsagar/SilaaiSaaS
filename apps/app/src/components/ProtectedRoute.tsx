import React from 'react';
import { Route, Redirect, type RouteProps } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
