import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonSkeletonText, IonBadge, IonButton, IonSpinner,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useOrder, useConfirmOrder } from '../hooks/useOrders';
import OrderStatusBadge from '../components/OrderStatusBadge';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(parseInt(id));
  const confirmMutation = useConfirmOrder();

  return (
    <IonPage id="order-detail-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/orders" /></IonButtons>
          <IonTitle>{order?.orderNumber ?? 'Order Detail'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {isLoading ? (
          <IonSkeletonText animated style={{ height: 120, borderRadius: 12 }} />
        ) : order ? (
          <div className="fade-in-up">
            {/* Header Card */}
            <div className="silaai-card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{order.orderNumber}</h2>
                <OrderStatusBadge status={order.status} />
              </div>
              <div style={{ color: 'var(--ion-color-medium)', fontSize: '0.875rem' }}>
                <div style={{ marginBottom: 6 }}>Customer: <strong style={{ color: 'var(--ion-text-color)' }}>{order.customer.name}</strong></div>
                <div style={{ marginBottom: 6 }}>Booking: {new Date(order.bookingDate).toLocaleDateString('en-IN')}</div>
                <div>Delivery: <strong style={{ color: order.deliveryDate < new Date().toISOString().split('T')[0] ? 'var(--ion-color-danger)' : 'var(--ion-color-success)' }}>{new Date(order.deliveryDate).toLocaleDateString('en-IN')}</strong></div>
              </div>
            </div>

            {/* Financials */}
            <div className="silaai-card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ion-color-medium)' }}>Payment</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Total Amount</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ion-color-primary)' }}>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Advance Paid</span>
                <span style={{ fontWeight: 600, color: 'var(--ion-color-success)' }}>₹{order.advancePaid.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(124,95,255,0.1)' }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Balance Due</span>
                <span style={{ fontWeight: 700, color: 'var(--ion-color-danger)' }}>₹{(order.totalAmount - order.advancePaid).toLocaleString()}</span>
              </div>
            </div>

            {/* Confirm button for DRAFT orders */}
            {order.status === 'DRAFT' && (
              <IonButton id="confirm-order-btn" expand="block" className="btn-gradient" onClick={() => confirmMutation.mutate(order.id)} disabled={confirmMutation.isPending}>
                {confirmMutation.isPending ? <IonSpinner name="crescent" /> : 'Confirm Order & Start Production'}
              </IonButton>
            )}
          </div>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default OrderDetailPage;
