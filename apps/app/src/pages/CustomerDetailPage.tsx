import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonSkeletonText, IonItem, IonLabel, IonList, IonChip,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CustomerSchema, MeasurementSchema } from '../schemas/customer';
import { z } from 'zod';

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = parseInt(id);

  const { data: customer, isLoading: loadingCustomer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => CustomerSchema.parse((await api.get(`/customers/${customerId}`)).data),
    enabled: !!customerId,
  });

  const { data: measurements, isLoading: loadingMeasurements } = useQuery({
    queryKey: ['measurements', customerId],
    queryFn: async () => z.array(MeasurementSchema).parse((await api.get(`/customers/${customerId}/measurements`)).data),
    enabled: !!customerId,
  });

  return (
    <IonPage id="customer-detail-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/customers" /></IonButtons>
          <IonTitle>{loadingCustomer ? 'Customer' : customer?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Customer Info */}
        <div className="silaai-card" style={{ padding: 20, marginBottom: 20 }}>
          {loadingCustomer ? <IonSkeletonText animated style={{ height: 24, width: '60%' }} /> : (
            <>
              <h2 style={{ margin: '0 0 6px', fontSize: '1.3rem' }}>{customer?.name}</h2>
              <p style={{ margin: 0, color: 'var(--ion-color-medium)' }}>{customer?.phone}</p>
            </>
          )}
        </div>

        {/* Measurements */}
        <h3 style={{ fontSize: '1rem', margin: '0 0 12px', color: 'var(--ion-color-medium)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Measurements
        </h3>
        <IonList>
          {loadingMeasurements ? Array.from({ length: 2 }).map((_, i) => (
            <IonItem key={i}><IonLabel><IonSkeletonText animated /></IonLabel></IonItem>
          )) : measurements?.length ? measurements.map((m) => (
            <IonItem key={m.id}>
              <IonLabel>
                <h3>{m.garmentType}</h3>
                <p>
                  {[
                    m.chest && `Chest: ${m.chest}"`,
                    m.waist && `Waist: ${m.waist}"`,
                    m.length && `Length: ${m.length}"`,
                  ].filter(Boolean).join('  •  ')}
                </p>
                {m.notes && <p style={{ color: 'var(--ion-color-tertiary)', fontSize: '0.8rem' }}>{m.notes}</p>}
              </IonLabel>
              <IonChip color="primary" slot="end" style={{ fontSize: '0.7rem' }}>
                {new Date(m.updatedAt).toLocaleDateString('en-IN')}
              </IonChip>
            </IonItem>
          )) : (
            <IonItem><IonLabel style={{ color: 'var(--ion-color-medium)' }}>No measurements recorded yet</IonLabel></IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CustomerDetailPage;
