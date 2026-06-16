import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonMenuButton, IonButtons, IonGrid, IonRow, IonCol,
  IonSkeletonText,
} from '@ionic/react';
import { useDashboard } from '../hooks/useTasks';

const stats = [
  { key: 'pendingOrders', label: 'Pending Orders', color: '#7C5FFF' },
  { key: 'todayDeliveries', label: "Today's Deliveries", color: '#00D4AA' },
  { key: 'lowStockCount', label: 'Low Stock', color: '#FF4961' },
  { key: 'readyOrders', label: 'Ready for Pickup', color: '#2DD36F' },
] as const;

const DashboardPage: React.FC = () => {
  const { data, isLoading } = useDashboard();

  return (
    <IonPage id="dashboard-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ marginBottom: 24 }} className="fade-in-up">
          <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>Shop Overview</h2>
          <p style={{ margin: 0, color: 'var(--ion-color-medium)', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <IonGrid style={{ padding: 0 }}>
          <IonRow>
            {stats.map(({ key, label, color }) => (
              <IonCol size="6" key={key} style={{ padding: '6px' }}>
                <div className="stat-card fade-in-up" style={{ borderColor: `${color}30` }}>
                  {isLoading ? (
                    <IonSkeletonText animated style={{ height: 32, width: '60%', margin: '0 auto' }} />
                  ) : (
                    <div className="stat-value" style={{ color }}>{(data as any)?.[key] ?? 0}</div>
                  )}
                  <div className="stat-label">{label}</div>
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--ion-color-medium)' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: '+ New Order', path: '/orders/new', color: 'var(--ion-color-primary)' },
              { label: 'View Tasks', path: '/tasks', color: 'var(--ion-color-secondary)' },
              { label: 'Customers', path: '/customers', color: 'var(--ion-color-tertiary)' },
              { label: 'Inventory', path: '/inventory', color: 'var(--ion-color-warning)' },
            ].map((item) => (
              <a key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: `${item.color}18`, border: `1px solid ${item.color}40`,
                  borderRadius: 12, padding: '16px 12px', textAlign: 'center',
                  color: item.color, fontWeight: 600, fontSize: '0.9rem',
                  transition: 'all 0.2s ease', cursor: 'pointer',
                }}>
                  {item.label}
                </div>
              </a>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
