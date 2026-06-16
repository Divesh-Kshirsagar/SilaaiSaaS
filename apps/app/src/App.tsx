import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { applyTheme, useUiStore } from './stores/uiStore';
import ProtectedRoute from './components/ProtectedRoute';
import AppMenu from './components/AppMenu';
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

setupIonicReact();

const App: React.FC = () => {
  // Apply theme on load
  React.useEffect(() => {
    applyTheme();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main-content" when="md">
          <AppMenu />
          <IonRouterOutlet id="main-content">
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
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
