import React from 'react';
import {
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonIcon, IonLabel, IonFooter, IonMenuToggle, IonButton,
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import {
  speedometerOutline, peopleOutline, listOutline,
  cubeOutline, checkboxOutline, logOutOutline, closeOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../stores/authStore';
import ThemeToggle from './ThemeToggle';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: speedometerOutline },
  { label: 'Customers',  href: '/customers',  icon: peopleOutline },
  { label: 'Orders',     href: '/orders',     icon: listOutline },
  { label: 'Inventory',  href: '/inventory',  icon: cubeOutline },
  { label: 'Tasks',      href: '/tasks',      icon: checkboxOutline },
];

const AppMenu: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <IonMenu contentId="main-content" menuId="app-menu">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>SilaaiSaaS</IonTitle>
          {/* Native Ionic close button — works on both mobile and desktop */}
          <IonMenuToggle slot="end">
            <IonButton fill="clear" color="light" id="menu-close-btn">
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonMenuToggle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {user && (
          <IonItem lines="full" color="light">
            <IonLabel>
              <h3>{user.name}</h3>
              <p>{user.role}</p>
            </IonLabel>
          </IonItem>
        )}

        <IonList>
          {menuItems.map((item) => (
            <IonMenuToggle key={item.href} autoHide={false}>
              <IonItem
                routerLink={item.href}
                routerDirection="root"
                lines="none"
                color={location.pathname.startsWith(item.href) ? 'primary' : undefined}
                id={`menu-item-${item.label.toLowerCase()}`}
              >
                <IonIcon slot="start" icon={item.icon} />
                <IonLabel>{item.label}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonMenuToggle slot="end" autoHide={false}>
            <IonButton fill="clear" color="danger" id="logout-btn" onClick={logout}>
              <IonIcon slot="start" icon={logOutOutline} />
              Logout
            </IonButton>
          </IonMenuToggle>
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  );
};

export default AppMenu;
