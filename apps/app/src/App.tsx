import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Content, Theme } from '@carbon/react';

/* Global Carbon Styles */
import './index.scss';

import ProtectedRoute from './components/ProtectedRoute';
import AppHeader from './components/AppHeader';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import OrderListPage from './pages/OrderListPage';
import NewOrderPage from './pages/NewOrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import InventoryManagePage from './pages/InventoryManagePage';
import TasksPage from './pages/TasksPage';
import CustomerPortalPage from './pages/CustomerPortalPage';

const App: React.FC = () => {
  return (
    <Router>
      <Theme theme="white">
        <AppHeader />
        {/* Carbon requires main content to be wrapped in <Content> to push below the fixed header */}
        <Content>
          <Switch>
            {/* Public Routes */}
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/track/:orderNumber" component={CustomerPortalPage} />

            {/* Protected Routes */}
            <ProtectedRoute exact path="/dashboard" component={DashboardPage} />
            <ProtectedRoute exact path="/customers" component={CustomersPage} />
            <ProtectedRoute exact path="/customers/:id" component={CustomerDetailPage} />
            <ProtectedRoute exact path="/orders" component={OrderListPage} />
            <ProtectedRoute exact path="/orders/new" component={NewOrderPage} />
            <ProtectedRoute exact path="/orders/:id" component={OrderDetailPage} />
            <ProtectedRoute exact path="/inventory" component={InventoryManagePage} />
            <ProtectedRoute exact path="/tasks" component={TasksPage} />

            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </Content>
      </Theme>
    </Router>
  );
};

export default App;
