import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonButton, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonInput, IonSpinner, IonText, IonDatetime,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { useGarments, useFabrics } from '../hooks/useInventory';
import { useCreateOrder, useConfirmOrder } from '../hooks/useOrders';

const NewOrderPage: React.FC = () => {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [garmentId, setGarmentId] = useState<number | null>(null);
  const [fabricId, setFabricId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [advance, setAdvance] = useState(0);
  const [error, setError] = useState('');

  const { data: customers } = useCustomers();
  const { data: garments } = useGarments();
  const { data: fabrics } = useFabrics();
  const createOrder = useCreateOrder();
  const confirmOrder = useConfirmOrder();

  const stepTitles = ['Customer', 'Garment', 'Fabric', 'Delivery', 'Confirm'];

  const handleSubmit = async () => {
    if (!customerId || !garmentId || !deliveryDate) { setError('Please fill all required fields.'); return; }
    setError('');
    try {
      const order = await createOrder.mutateAsync({
        customerId,
        deliveryDate,
        advancePaid: advance,
        items: [{ garmentCatalogId: garmentId, quantity, fabricId, measurementId: null }],
      });
      await confirmOrder.mutateAsync(order.id);
      history.replace('/orders');
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Failed to place order.');
    }
  };

  const selectedGarment = garments?.find((g) => g.id === garmentId);
  const selectedCustomer = customers?.find((c) => c.id === customerId);

  return (
    <IonPage id="new-order-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/orders" /></IonButtons>
          <IonTitle>New Order — {stepTitles[step]}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Step indicators */}
        <div className="wizard-steps">
          {stepTitles.map((_, i) => (
            <div key={i} className={`wizard-step-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        {/* Step 0: Customer */}
        {step === 0 && (
          <div className="fade-in-up">
            <h3>Select Customer</h3>
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px' }}>
              <IonLabel>Customer</IonLabel>
              <IonSelect id="order-customer-select" value={customerId} onIonChange={(e) => setCustomerId(e.detail.value)} placeholder="Choose customer">
                {customers?.map((c) => <IonSelectOption key={c.id} value={c.id}>{c.name} ({c.phone})</IonSelectOption>)}
              </IonSelect>
            </IonItem>
            <IonButton expand="block" className="btn-gradient" disabled={!customerId} onClick={() => setStep(1)} style={{ marginTop: 24 }}>Next</IonButton>
          </div>
        )}

        {/* Step 1: Garment */}
        {step === 1 && (
          <div className="fade-in-up">
            <h3>Select Garment</h3>
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px', marginBottom: 14 }}>
              <IonLabel>Garment Type</IonLabel>
              <IonSelect id="order-garment-select" value={garmentId} onIonChange={(e) => setGarmentId(e.detail.value)} placeholder="Choose garment">
                {garments?.map((g) => <IonSelectOption key={g.id} value={g.id}>{g.name} — ₹{g.basePrice}</IonSelectOption>)}
              </IonSelect>
            </IonItem>
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px' }}>
              <IonLabel position="floating">Quantity</IonLabel>
              <IonInput id="order-quantity-input" type="number" value={quantity} min={1} onIonChange={(e) => setQuantity(parseInt(e.detail.value!) || 1)} />
            </IonItem>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <IonButton fill="outline" onClick={() => setStep(0)} style={{ flex: 1 }}>Back</IonButton>
              <IonButton className="btn-gradient" disabled={!garmentId} onClick={() => setStep(2)} style={{ flex: 2 }}>Next</IonButton>
            </div>
          </div>
        )}

        {/* Step 2: Fabric */}
        {step === 2 && (
          <div className="fade-in-up">
            <h3>Select Fabric</h3>
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px' }}>
              <IonLabel>Fabric (optional)</IonLabel>
              <IonSelect id="order-fabric-select" value={fabricId} onIonChange={(e) => setFabricId(e.detail.value)} placeholder="From shop stock">
                <IonSelectOption value={null}>Customer's own fabric</IonSelectOption>
                {fabrics?.map((f) => (
                  <IonSelectOption key={f.id} value={f.id} disabled={f.lowStock}>
                    {f.name} ({f.quantityAvailable}m){f.lowStock ? ' ⚠️ Low' : ''}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <IonButton fill="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</IonButton>
              <IonButton className="btn-gradient" onClick={() => setStep(3)} style={{ flex: 2 }}>Next</IonButton>
            </div>
          </div>
        )}

        {/* Step 3: Delivery */}
        {step === 3 && (
          <div className="fade-in-up">
            <h3>Delivery & Payment</h3>
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px', marginBottom: 14 }}>
              <IonLabel position="floating">Delivery Date</IonLabel>
              <IonInput id="order-delivery-date" type="date" value={deliveryDate} onIonChange={(e) => setDeliveryDate(e.detail.value!)} />
            </IonItem>
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px' }}>
              <IonLabel position="floating">Advance Paid (₹)</IonLabel>
              <IonInput id="order-advance-input" type="number" value={advance} onIonChange={(e) => setAdvance(parseFloat(e.detail.value!) || 0)} />
            </IonItem>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <IonButton fill="outline" onClick={() => setStep(2)} style={{ flex: 1 }}>Back</IonButton>
              <IonButton className="btn-gradient" disabled={!deliveryDate} onClick={() => setStep(4)} style={{ flex: 2 }}>Next</IonButton>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="fade-in-up">
            <h3>Review & Confirm</h3>
            <div className="silaai-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Customer</span>
                <span style={{ fontWeight: 600 }}>{selectedCustomer?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Garment</span>
                <span style={{ fontWeight: 600 }}>{selectedGarment?.name} × {quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Total</span>
                <span style={{ fontWeight: 700, color: 'var(--ion-color-primary)', fontSize: '1.1rem' }}>
                  ₹{((selectedGarment?.basePrice ?? 0) * quantity).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Advance</span>
                <span>₹{advance.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ion-color-medium)' }}>Delivery</span>
                <span>{deliveryDate}</span>
              </div>
            </div>

            {error && <IonText color="danger"><p style={{ fontSize: '0.85rem' }}>{error}</p></IonText>}

            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <IonButton fill="outline" onClick={() => setStep(3)} style={{ flex: 1 }}>Back</IonButton>
              <IonButton id="place-order-btn" className="btn-gradient" onClick={handleSubmit} disabled={createOrder.isPending || confirmOrder.isPending} style={{ flex: 2 }}>
                {createOrder.isPending || confirmOrder.isPending ? <IonSpinner name="crescent" /> : 'Place & Confirm Order'}
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NewOrderPage;
