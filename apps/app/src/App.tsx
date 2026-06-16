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
import '@ionic/react/css/palettes/dark.always.css';

import './theme/variables.css';
import './theme/global.css';

import AppMenu from './components/AppMenu';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import OrderListPage from './pages/OrderListPage';
import NewOrderPage from './pages/NewOrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import InventoryPage from './pages/InventoryPage';
import TasksPage from './pages/TasksPage';

setupIonicReact({ mode: 'md' });

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonSplitPane contentId="main-content">
        <AppMenu />
        <IonRouterOutlet id="main-content">
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute exact path="/dashboard" component={DashboardPage} />
            <ProtectedRoute exact path="/customers" component={CustomersPage} />
            <ProtectedRoute exact path="/customers/:id" component={CustomerDetailPage} />
            <ProtectedRoute exact path="/orders" component={OrderListPage} />
            <ProtectedRoute exact path="/orders/new" component={NewOrderPage} />
            <ProtectedRoute exact path="/orders/:id" component={OrderDetailPage} />
            <ProtectedRoute exact path="/inventory" component={InventoryPage} />
            <ProtectedRoute exact path="/tasks" component={TasksPage} />
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  </IonApp>
);

export default App;
