import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon,
  IonSpinner, IonModal, IonButton, IonInput, IonBadge, IonSegment, IonSegmentButton
} from '@ionic/react';
import { addOutline, cubeOutline } from 'ionicons/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const InventoryManagePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'fabrics' | 'garments'>('fabrics');

  // --- Fabrics State ---
  const { data: fabrics, isLoading: fabricsLoading } = useQuery({
    queryKey: ['fabrics'],
    queryFn: async () => (await api.get('/fabrics')).data,
  });

  const [showFabricModal, setShowFabricModal] = useState(false);
  const [fName, setFName] = useState('');
  const [fQty, setFQty] = useState<number>(0);
  const [fReorder, setFReorder] = useState<number>(50);

  const [stockModalFabricId, setStockModalFabricId] = useState<number | null>(null);
  const [stockChange, setStockChange] = useState<number>(0);

  const createFabric = useMutation({
    mutationFn: async (data: any) => await api.post('/fabrics', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fabrics'] }); setShowFabricModal(false); }
  });

  const addStock = useMutation({
    mutationFn: async ({ id, qty }: { id: number, qty: number }) =>
      await api.put(`/fabrics/${id}/stock`, { quantityChange: qty, reason: 'RESTOCK' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['fabrics'] }); setStockModalFabricId(null); }
  });

  // --- Garments State ---
  const { data: garments, isLoading: garmentsLoading } = useQuery({
    queryKey: ['garments'],
    queryFn: async () => (await api.get('/garments')).data,
  });

  const [showGarmentModal, setShowGarmentModal] = useState(false);
  const [gName, setGName] = useState('');
  const [gPrice, setGPrice] = useState<number>(0);
  const [gCons, setGCons] = useState<number>(1.5);

  const createGarment = useMutation({
    mutationFn: async (data: any) => await api.post('/garments', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['garments'] }); setShowGarmentModal(false); }
  });

  return (
    <IonPage id="inventory-manage-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Manage Inventory</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={tab} onIonChange={e => setTab(e.detail.value as any)}>
            <IonSegmentButton value="fabrics"><IonLabel>Fabrics</IonLabel></IonSegmentButton>
            <IonSegmentButton value="garments"><IonLabel>Garments</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {tab === 'fabrics' && (
          <>
            <IonList>
              {fabricsLoading && <IonSpinner />}
              {fabrics?.map((f: any) => (
                <IonItem key={f.id}>
                  <IonIcon slot="start" icon={cubeOutline} />
                  <IonLabel>
                    <h2>{f.name}</h2>
                    <p>Stock: {f.quantityAvailable}m (Reorder: {f.reorderLevel}m)</p>
                  </IonLabel>
                  {f.lowStock && <IonBadge color="danger" slot="end">Low Stock</IonBadge>}
                  <IonButton slot="end" fill="outline" onClick={() => setStockModalFabricId(f.id)}>Add Stock</IonButton>
                </IonItem>
              ))}
            </IonList>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => setShowFabricModal(true)}><IonIcon icon={addOutline} /></IonFabButton>
            </IonFab>
          </>
        )}

        {tab === 'garments' && (
          <>
            <IonList>
              {garmentsLoading && <IonSpinner />}
              {garments?.map((g: any) => (
                <IonItem key={g.id}>
                  <IonLabel>
                    <h2>{g.name}</h2>
                    <p>Base Price: ₹{g.basePrice} | Fabric needed: {g.defaultFabricConsumptionMeters}m</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => setShowGarmentModal(true)}><IonIcon icon={addOutline} /></IonFabButton>
            </IonFab>
          </>
        )}

        {/* Create Fabric Modal */}
        <IonModal isOpen={showFabricModal} onDidDismiss={() => setShowFabricModal(false)} initialBreakpoint={0.75} breakpoints={[0, 0.75]}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>New Fabric</IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowFabricModal(false)}>Close</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem><IonLabel position="stacked">Fabric Name</IonLabel><IonInput value={fName} onIonInput={e => setFName(e.detail.value!)} /></IonItem>
            <IonItem><IonLabel position="stacked">Initial Quantity (m)</IonLabel><IonInput type="number" value={fQty} onIonInput={e => setFQty(Number(e.detail.value))} /></IonItem>
            <IonItem><IonLabel position="stacked">Reorder Level (m)</IonLabel><IonInput type="number" value={fReorder} onIonInput={e => setFReorder(Number(e.detail.value))} /></IonItem>
            <IonButton expand="block" className="ion-margin-top" onClick={() => createFabric.mutate({ name: fName, quantityAvailable: fQty, reorderLevel: fReorder })}>Save Fabric</IonButton>
          </IonContent>
        </IonModal>

        {/* Add Stock Modal */}
        <IonModal isOpen={stockModalFabricId !== null} onDidDismiss={() => setStockModalFabricId(null)} initialBreakpoint={0.5} breakpoints={[0, 0.5]}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add Stock</IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setStockModalFabricId(null)}>Close</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem><IonLabel position="stacked">Quantity to Add (m)</IonLabel><IonInput type="number" value={stockChange} onIonInput={e => setStockChange(Number(e.detail.value))} /></IonItem>
            <IonButton expand="block" className="ion-margin-top" onClick={() => addStock.mutate({ id: stockModalFabricId!, qty: stockChange })}>Update Stock</IonButton>
          </IonContent>
        </IonModal>

        {/* Create Garment Modal */}
        <IonModal isOpen={showGarmentModal} onDidDismiss={() => setShowGarmentModal(false)} initialBreakpoint={0.75} breakpoints={[0, 0.75]}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>New Garment</IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowGarmentModal(false)}>Close</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem><IonLabel position="stacked">Garment Name</IonLabel><IonInput value={gName} onIonInput={e => setGName(e.detail.value!)} /></IonItem>
            <IonItem><IonLabel position="stacked">Base Price (₹)</IonLabel><IonInput type="number" value={gPrice} onIonInput={e => setGPrice(Number(e.detail.value))} /></IonItem>
            <IonItem><IonLabel position="stacked">Default Fabric Needed (m)</IonLabel><IonInput type="number" value={gCons} onIonInput={e => setGCons(Number(e.detail.value))} /></IonItem>
            <IonButton expand="block" className="ion-margin-top" onClick={() => createGarment.mutate({ name: gName, basePrice: gPrice, defaultFabricConsumptionMeters: gCons })}>Save Garment</IonButton>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default InventoryManagePage;
