import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem,
  IonSkeletonText, IonFab, IonFabButton, IonIcon,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import OrderStatusBadge from '../components/OrderStatusBadge';
import type { OrderStatus } from '../constants/enums';

const segments: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'CONFIRMED', label: 'Active' },
  { value: 'READY', label: 'Ready' },
  { value: 'DELIVERED', label: 'Done' },
];

const OrderListPage: React.FC = () => {
  const history = useHistory();
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const { data: orders, isLoading } = useOrders(filter === 'ALL' ? undefined : filter);

  return (
    <IonPage id="order-list-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Orders</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value as OrderStatus | 'ALL')}
            scrollable style={{ '--background': 'transparent' }}>
            {segments.map((s) => (
              <IonSegmentButton key={s.value} value={s.value}>
                <IonLabel style={{ fontSize: '0.8rem' }}>{s.label}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => (
            <IonItem key={i}><IonLabel><IonSkeletonText animated style={{ width: '70%' }} /><IonSkeletonText animated style={{ width: '45%' }} /></IonLabel></IonItem>
          )) : orders?.map((o) => (
            <IonItem key={o.id} button onClick={() => history.push(`/orders/${o.id}`)} detail>
              <IonLabel>
                <h3 style={{ fontWeight: 600 }}>{o.orderNumber} — {o.customer.name}</h3>
                <p>Delivery: {new Date(o.deliveryDate).toLocaleDateString('en-IN')} &nbsp;|&nbsp; ₹{o.totalAmount.toLocaleString()}</p>
              </IonLabel>
              <OrderStatusBadge status={o.status} />
            </IonItem>
          ))}
          {!isLoading && !orders?.length && (
            <IonItem><IonLabel style={{ color: 'var(--ion-color-medium)', textAlign: 'center' }}>No orders found</IonLabel></IonItem>
          )}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="new-order-btn" onClick={() => history.push('/orders/new')}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default OrderListPage;
