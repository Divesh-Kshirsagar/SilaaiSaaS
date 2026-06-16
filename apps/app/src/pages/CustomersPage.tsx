import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon,
  IonModal, IonButton, IonInput, IonSpinner, IonSearchbar,
} from '@ionic/react';
import { addOutline, callOutline, personOutline } from 'ionicons/icons';
import { useCustomers, useCreateCustomer } from '../hooks/useCustomers';

const CustomersPage: React.FC = () => {
  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [search, setSearch] = useState('');

  const filteredCustomers = customers?.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  ) ?? [];

  const handleSave = async () => {
    if (!name || !phone) return;
    await createMutation.mutateAsync({ name, phone });
    setShowModal(false);
    setName('');
    setPhone('');
  };

  return (
    <IonPage id="customers-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Customers</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value!)}
            placeholder="Search by name or phone"
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {isLoading && <IonItem><IonSpinner name="dots" /></IonItem>}
          {filteredCustomers.map((c) => (
            <IonItem key={c.id} routerLink={`/customers/${c.id}`} detail>
              <IonLabel>
                <h2>{c.name}</h2>
                <p>{c.phone}</p>
              </IonLabel>
            </IonItem>
          ))}
          {!isLoading && filteredCustomers.length === 0 && (
            <IonItem><IonLabel className="ion-text-center" color="medium">No customers found</IonLabel></IonItem>
          )}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="add-customer-fab" onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.75, 1]} initialBreakpoint={0.75}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>New Customer</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonIcon slot="start" icon={personOutline} />
              <IonLabel position="stacked">Full Name</IonLabel>
              <IonInput id="customer-name-input" value={name} onIonInput={(e) => setName(e.detail.value!)} placeholder="e.g. Rahul Sharma" />
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={callOutline} />
              <IonLabel position="stacked">Phone Number</IonLabel>
              <IonInput id="customer-phone-input" type="tel" value={phone} onIonInput={(e) => setPhone(e.detail.value!)} placeholder="10-digit number" />
            </IonItem>
            <IonButton
              id="save-customer-btn"
              expand="block"
              className="ion-margin-top"
              onClick={handleSave}
              disabled={createMutation.isPending || !name || !phone}
            >
              {createMutation.isPending ? <IonSpinner name="crescent" /> : 'Save Customer'}
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CustomersPage;
