import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonList, IonItem, IonLabel, IonSkeletonText, IonBadge, IonButton, IonSpinner,
} from '@ionic/react';
import { useFabrics } from '../hooks/useInventory';
import LowStockBanner from '../components/LowStockBanner';

const InventoryPage: React.FC = () => {
  const { data: fabrics, isLoading } = useFabrics();
  const lowCount = fabrics?.filter((f) => f.lowStock).length ?? 0;

  return (
    <IonPage id="inventory-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Inventory</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <LowStockBanner count={lowCount} />

        <IonList>
          {isLoading ? Array.from({ length: 4 }).map((_, i) => (
            <IonItem key={i}><IonLabel><IonSkeletonText animated style={{ width: '55%' }} /><IonSkeletonText animated style={{ width: '35%' }} /></IonLabel></IonItem>
          )) : fabrics?.map((f) => (
            <IonItem key={f.id}>
              <IonLabel>
                <h3>{f.name}</h3>
                <p>
                  Available: <strong>{f.quantityAvailable}m</strong>
                  &nbsp;|&nbsp; Reorder at: {f.reorderLevel}m
                </p>
              </IonLabel>
              <IonBadge slot="end" color={f.lowStock ? 'danger' : 'success'} style={{ borderRadius: 6 }}>
                {f.lowStock ? 'Low Stock' : 'OK'}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default InventoryPage;
