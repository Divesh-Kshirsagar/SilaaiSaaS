import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonSpinner, IonIcon, IonButton
} from '@ionic/react';
import { useDashboard } from '../hooks/useTasks';
import { useAuthStore } from '../stores/authStore';
import { arrowForwardOutline, cubeOutline, listOutline, peopleOutline, checkboxOutline } from 'ionicons/icons';

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboard();
  const { user } = useAuthStore();

  return (
    <IonPage id="dashboard-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Welcome back, {user?.name}</h2>

        {isLoading ? <IonSpinner /> : (
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonCard color="primary">
                  <IonCardHeader><IonCardTitle>{stats?.pendingOrders ?? 0}</IonCardTitle></IonCardHeader>
                  <IonCardContent>Pending Orders</IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard color="warning">
                  <IonCardHeader><IonCardTitle>{stats?.todayDeliveries ?? 0}</IonCardTitle></IonCardHeader>
                  <IonCardContent>Today's Deliveries</IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonCard color="danger">
                  <IonCardHeader><IonCardTitle>{stats?.lowStockCount ?? 0}</IonCardTitle></IonCardHeader>
                  <IonCardContent>Low Stock Items</IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard color="success">
                  <IonCardHeader><IonCardTitle>{stats?.readyOrders ?? 0}</IonCardTitle></IonCardHeader>
                  <IonCardContent>Ready to Deliver</IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        <h3 className="ion-margin-top">Quick Actions</h3>
        <IonCard>
          <IonButton expand="block" fill="clear" routerLink="/orders/new" className="ion-justify-content-start">
            <IonIcon slot="start" icon={addOutline} />
            Create New Order
            <IonIcon slot="end" icon={arrowForwardOutline} />
          </IonButton>
          <IonButton expand="block" fill="clear" routerLink="/tasks">
            <IonIcon slot="start" icon={checkboxOutline} />
            View Tasks
            <IonIcon slot="end" icon={arrowForwardOutline} />
          </IonButton>
          <IonButton expand="block" fill="clear" routerLink="/customers">
            <IonIcon slot="start" icon={peopleOutline} />
            Manage Customers
            <IonIcon slot="end" icon={arrowForwardOutline} />
          </IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

// Required for quick actions
import { addOutline } from 'ionicons/icons';

export default DashboardPage;
