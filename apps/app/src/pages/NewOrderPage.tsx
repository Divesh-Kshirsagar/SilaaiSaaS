import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonButton, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonInput, IonSpinner, IonText, IonDatetime, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonList, IonProgressBar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { useFabrics, useGarments } from '../hooks/useInventory';
import { useCreateOrder } from '../hooks/useOrders';

const NewOrderPage: React.FC = () => {
  const history = useHistory();
  const { data: customers, isLoading: loadingCustomers } = useCustomers();
  const { data: inventory, isLoading: loadingInventory } = useFabrics();
  const { data: garments, isLoading: loadingGarments } = useGarments();
  const createMutation = useCreateOrder();

  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [garmentCatalogId, setGarmentCatalogId] = useState<number | null>(null);
  const [fabricId, setFabricId] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString());
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(1000); // MVP hardcoded

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!customerId || !garmentCatalogId) return;
    try {
      const res = await createMutation.mutateAsync({
        customerId,
        deliveryDate: deliveryDate.split('T')[0],
        advancePaid,
        items: [{ garmentCatalogId, fabricId: fabricId || null, quantity: 1, measurementId: null }]
      });
      history.replace(`/orders/${res.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !customerId;
    if (step === 2) return !garmentCatalogId;
    return false;
  };

  return (
    <IonPage id="new-order-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/orders" /></IonButtons>
          <IonTitle>New Order</IonTitle>
        </IonToolbar>
        <IonProgressBar value={step / 5} color="primary" />
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {step === 1 && '1. Select Customer'}
              {step === 2 && '2. Garment Details'}
              {step === 3 && '3. Select Fabric'}
              {step === 4 && '4. Delivery & Payment'}
              {step === 5 && '5. Review & Confirm'}
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {/* Step 1 */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              {loadingCustomers ? <IonSpinner /> : (
                <IonList>
                  <IonItem>
                    <IonLabel position="stacked">Customer</IonLabel>
                    <IonSelect
                      id="order-customer-select"
                      value={customerId}
                      onIonChange={e => setCustomerId(e.detail.value)}
                      placeholder="Select Customer"
                    >
                      {customers?.map(c => (
                        <IonSelectOption key={c.id} value={c.id}>{c.name} ({c.phone})</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonList>
              )}
            </div>

            {/* Step 2 */}
            <div style={{ display: step === 2 ? 'block' : 'none' }}>
              {loadingGarments ? <IonSpinner /> : (
                <IonList>
                  <IonItem>
                    <IonLabel position="stacked">Garment Type</IonLabel>
                    <IonSelect
                      id="order-garment-select"
                      value={garmentCatalogId}
                      onIonChange={e => {
                        const id = e.detail.value;
                        setGarmentCatalogId(id);
                        const g = garments?.find((g: any) => g.id === id);
                        if (g && totalAmount === 1000) setTotalAmount(g.basePrice);
                      }}
                      placeholder="Select Garment"
                    >
                      {garments?.map((g: any) => (
                        <IonSelectOption key={g.id} value={g.id}>{g.name} (₹{g.basePrice})</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonList>
              )}
            </div>

            {/* Step 3 */}
            <div style={{ display: step === 3 ? 'block' : 'none' }}>
              {loadingInventory ? <IonSpinner /> : (
                <IonList>
                  <IonItem>
                    <IonLabel position="stacked">Fabric</IonLabel>
                    <IonSelect
                      id="order-fabric-select"
                      value={fabricId}
                      onIonChange={e => setFabricId(e.detail.value)}
                      placeholder="Select Fabric from Inventory"
                    >
                      {inventory?.map((f: any) => (
                        <IonSelectOption key={f.id} value={f.id}>{f.name} ({f.quantityAvailable}m left)</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonList>
              )}
            </div>

            {/* Step 4 */}
            <div style={{ display: step === 4 ? 'block' : 'none' }}>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Delivery Date</IonLabel>
                  <IonDatetime
                    presentation="date"
                    value={deliveryDate}
                    onIonChange={e => setDeliveryDate(e.detail.value as string)}
                    min={new Date().toISOString()}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Total Amount (₹)</IonLabel>
                  <IonInput
                    type="number"
                    value={totalAmount}
                    onIonInput={e => setTotalAmount(Number(e.detail.value))}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Advance Paid (₹)</IonLabel>
                  <IonInput
                    id="order-advance-input"
                    type="number"
                    value={advancePaid}
                    onIonInput={e => setAdvancePaid(Number(e.detail.value))}
                  />
                </IonItem>
              </IonList>
            </div>

            {/* Step 5 */}
            <div style={{ display: step === 5 ? 'block' : 'none' }}>
              <IonList lines="full">
                <IonItem><IonLabel>Customer: <b>{customers?.find((c: any) => c.id === customerId)?.name}</b></IonLabel></IonItem>
                <IonItem><IonLabel>Garment: <b>{garments?.find((g: any) => g.id === garmentCatalogId)?.name}</b></IonLabel></IonItem>
                <IonItem><IonLabel>Fabric: <b>{inventory?.find((f: any) => f.id === fabricId)?.name || 'None'}</b></IonLabel></IonItem>
                <IonItem><IonLabel>Delivery: <b>{deliveryDate.split('T')[0]}</b></IonLabel></IonItem>
                <IonItem><IonLabel>Total: <b>₹{totalAmount}</b> | Advance: <b>₹{advancePaid}</b></IonLabel></IonItem>
              </IonList>
              {createMutation.isError && (
                <IonText color="danger"><p>Failed to create order.</p></IonText>
              )}
            </div>

            <div className="ion-margin-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <IonButton
                fill="outline"
                onClick={handlePrev}
                disabled={step === 1 || createMutation.isPending}
              >
                Back
              </IonButton>
              {step < 5 ? (
                <IonButton onClick={handleNext} disabled={isNextDisabled()}>Next</IonButton>
              ) : (
                <IonButton
                  id="confirm-order-btn"
                  color="success"
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? <IonSpinner name="dots" /> : 'Confirm Order'}
                </IonButton>
              )}
            </div>

          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NewOrderPage;
