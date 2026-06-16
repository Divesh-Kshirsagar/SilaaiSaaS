import React, { useState } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonItem, IonLabel, IonInput, IonButton, IonSpinner,
  IonText, IonIcon
} from '@ionic/react';
import { searchOutline, checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import axios from 'axios';
import { applyTheme, useUiStore } from '../stores/uiStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

const CustomerPortalPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => { applyTheme(); }, []);

  const handleSearch = async () => {
    if (!orderNumber) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await axios.get(`${API_BASE}/portal/orders/${orderNumber.trim()}`);
      setOrder(res.data);
    } catch {
      setError('Order not found. Please check your tracking number.');
    } finally {
      setLoading(false);
    }
  };

  const statusTimeline = ['DRAFT', 'CONFIRMED', 'CUTTING', 'STITCHING', 'QUALITY_CHECK', 'READY_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = order ? statusTimeline.indexOf(order.status) : -1;

  return (
    <IonPage id="customer-portal-page">
      <IonContent className="ion-padding">
        <div className="ion-text-center ion-padding-top">
          <h1>Track Your Order</h1>
          <p>Enter your tracking number below</p>
        </div>

        <IonCard>
          <IonCardContent>
            <IonItem lines="none">
              <IonLabel position="stacked">Order Number (e.g. ORD-1)</IonLabel>
              <IonInput
                value={orderNumber}
                onIonInput={e => setOrderNumber(e.detail.value!)}
                placeholder="ORD-..."
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </IonItem>
            <IonButton expand="block" onClick={handleSearch} disabled={loading || !orderNumber} className="ion-margin-top">
              {loading ? <IonSpinner name="dots" /> : <><IonIcon icon={searchOutline} slot="start" /> Track Order</>}
            </IonButton>
            {error && <IonText color="danger" className="ion-text-center"><p>{error}</p></IonText>}
          </IonCardContent>
        </IonCard>

        {order && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Order {order.orderNumber}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel>
                  <h3>Customer Name</h3>
                  <p>{order.customerName}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Expected Delivery</h3>
                  <p>{order.deliveryDate}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Payment Status</h3>
                  <p>Total: ₹{order.totalAmount} | Paid: ₹{order.advancePaid}</p>
                </IonLabel>
              </IonItem>

              <div className="ion-margin-top">
                <h3>Status Timeline</h3>
                {statusTimeline.map((step, idx) => {
                  const isPastOrCurrent = idx <= currentIndex;
                  return (
                    <IonItem key={step} lines="none">
                      <IonIcon
                        slot="start"
                        icon={isPastOrCurrent ? checkmarkCircle : ellipseOutline}
                        color={isPastOrCurrent ? 'success' : 'medium'}
                      />
                      <IonLabel color={isPastOrCurrent ? 'dark' : 'medium'}>{step.replace(/_/g, ' ')}</IonLabel>
                    </IonItem>
                  );
                })}
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CustomerPortalPage;
