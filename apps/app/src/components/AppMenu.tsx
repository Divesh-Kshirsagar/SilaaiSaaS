import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonAvatar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { gridOutline, peopleOutline, cartOutline, cubeOutline, checkboxOutline, logOutOutline } from 'ionicons/icons';
import { useAuthStore } from '../stores/authStore';

const menuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: gridOutline },
  { title: 'Customers',  path: '/customers',  icon: peopleOutline },
  { title: 'Orders',     path: '/orders',     icon: cartOutline },
  { title: 'Inventory',  path: '/inventory',  icon: cubeOutline },
  { title: 'Tasks',      path: '/tasks',      icon: checkboxOutline },
];

const AppMenu: React.FC = () => {
  const { user, logout } = useAuthStore();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <IonMenu contentId="main-content" side="start">
      <IonHeader>
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }}>
          <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <IonAvatar style={{ width: 40, height: 40, background: 'var(--ion-color-primary)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{user?.name?.[0] ?? 'S'}</span>
            </IonAvatar>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ion-text-color)', fontSize: 14 }}>{user?.name ?? 'SilaaiSaaS'}</div>
              <div style={{ fontSize: 11, color: 'var(--ion-color-medium)', textTransform: 'capitalize' }}>{user?.role?.toLowerCase()}</div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
        <IonList lines="none" style={{ paddingTop: 8 }}>
          {menuItems.map((item) => (
            <IonMenuToggle key={item.path} autoHide={false}>
              <IonItem button routerLink={item.path} routerDirection="root" detail={false}
                style={{ '--border-radius': '10px', margin: '2px 8px', '--padding-start': '12px' }}>
                <IonIcon slot="start" icon={item.icon} color="primary" />
                <IonLabel>{item.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>

        <IonList lines="none" style={{ position: 'absolute', bottom: 32, width: '100%' }}>
          <IonMenuToggle autoHide={false}>
            <IonItem button onClick={handleLogout} detail={false}
              style={{ '--border-radius': '10px', margin: '2px 8px', '--padding-start': '12px' }}>
              <IonIcon slot="start" icon={logOutOutline} color="danger" />
              <IonLabel color="danger">Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
