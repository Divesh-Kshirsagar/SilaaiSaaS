import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonSearchbar, IonList, IonItem, IonLabel, IonFab, IonFabButton,
  IonIcon, IonSkeletonText, IonModal, IonButton, IonInput, IonText,
} from '@ionic/react';
import { addOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useCustomers, useCreateCustomer } from '../hooks/useCustomers';

const CustomersPage: React.FC = () => {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');

  const { data: customers, isLoading } = useCustomers(search || undefined);
  const createMutation = useCreateCustomer();

  const handleCreate = async () => {
    if (!name.trim() || !phone.trim()) { setFormError('Name and phone are required.'); return; }
    try {
      await createMutation.mutateAsync({ name, phone });
      setShowModal(false); setName(''); setPhone(''); setFormError('');
    } catch { setFormError('Failed to create customer. Try again.'); }
  };

  return (
    <IonPage id="customers-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Customers</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar
          id="customer-search"
          value={search}
          onIonInput={(e) => setSearch(e.detail.value!)}
          placeholder="Search by name or phone"
          style={{ '--background': 'var(--silaai-surface-2)', paddingTop: 8 }}
        />

        <IonList>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => (
            <IonItem key={i}>
              <IonLabel><IonSkeletonText animated style={{ width: '60%' }} /><IonSkeletonText animated style={{ width: '40%' }} /></IonLabel>
            </IonItem>
          )) : customers?.map((c) => (
            <IonItem key={c.id} button onClick={() => history.push(`/customers/${c.id}`)} detail>
              <IonIcon slot="start" icon={personOutline} color="primary" />
              <IonLabel>
                <h3>{c.name}</h3>
                <p>{c.phone}</p>
              </IonLabel>
            </IonItem>
          ))}
          {!isLoading && !customers?.length && (
            <IonItem><IonLabel style={{ color: 'var(--ion-color-medium)', textAlign: 'center' }}>No customers found</IonLabel></IonItem>
          )}
        </IonList>

        {/* Add Customer FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="add-customer-btn" onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Add Customer Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader><IonToolbar><IonTitle>New Customer</IonTitle></IonToolbar></IonHeader>
          <IonContent className="ion-padding">
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px', marginBottom: 14 }}>
              <IonLabel position="floating">Full Name</IonLabel>
              <IonInput id="customer-name-input" value={name} onIonChange={(e) => setName(e.detail.value!)} />
            </IonItem>
            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px', marginBottom: 24 }}>
              <IonLabel position="floating">Phone Number</IonLabel>
              <IonInput id="customer-phone-input" type="tel" value={phone} onIonChange={(e) => setPhone(e.detail.value!)} />
            </IonItem>
            {formError && <IonText color="danger"><p style={{ fontSize: '0.85rem' }}>{formError}</p></IonText>}
            <IonButton id="save-customer-btn" expand="block" className="btn-gradient" onClick={handleCreate} disabled={createMutation.isPending}>
              Save Customer
            </IonButton>
            <IonButton expand="block" fill="outline" color="medium" onClick={() => setShowModal(false)} style={{ marginTop: 8 }}>
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CustomersPage;
