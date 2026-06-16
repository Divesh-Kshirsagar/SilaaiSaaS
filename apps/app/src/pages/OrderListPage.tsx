import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon,
  IonSpinner, IonSearchbar, IonSelect, IonSelectOption
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useOrders } from '../hooks/useOrders';
import { ORDER_STATUS } from '../constants/enums';
import OrderStatusBadge from '../components/OrderStatusBadge';

const OrderListPage: React.FC = () => {
  const { data: orders, isLoading } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = orders?.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) ?? [];

  return (
    <IonPage id="order-list-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Orders</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={e => setSearch(e.detail.value!)}
            placeholder="Search ORD- or customer..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonItem lines="none">
            <IonLabel>Filter Status:</IonLabel>
            <IonSelect value={statusFilter} onIonChange={e => setStatusFilter(e.detail.value)}>
              <IonSelectOption value="ALL">All Statuses</IonSelectOption>
              {Object.values(ORDER_STATUS).map(st => (
                <IonSelectOption key={st} value={st}>{st}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {isLoading && <IonItem><IonSpinner name="dots" /></IonItem>}
          {filteredOrders.map(o => (
            <IonItem key={o.id} routerLink={`/orders/${o.id}`} detail>
              <IonLabel>
                <h2><b>{o.orderNumber}</b> — {o.customer.name}</h2>
                <p>Delivery: {o.deliveryDate}</p>
              </IonLabel>
              <OrderStatusBadge status={o.status} />
            </IonItem>
          ))}
          {!isLoading && filteredOrders.length === 0 && (
            <IonItem><IonLabel className="ion-text-center" color="medium">No orders found</IonLabel></IonItem>
          )}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="new-order-fab" routerLink="/orders/new">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default OrderListPage;
