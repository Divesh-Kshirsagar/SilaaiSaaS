import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ProgressIndicator,
  ProgressStep,
  Tile,
  Select,
  SelectItem,
  TextInput,
  Button,
  Stack,
  InlineLoading,
  InlineNotification
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Checkmark } from '@carbon/icons-react';
import { useCustomers } from '../hooks/useCustomers';
import { useFabrics, useGarments } from '../hooks/useInventory';
import { useCreateOrder } from '../hooks/useOrders';

const NewOrderPage: React.FC = () => {
  const history = useHistory();
  const { data: customers, isLoading: loadingCustomers } = useCustomers();
  const { data: inventory, isLoading: loadingInventory } = useFabrics();
  const { data: garments, isLoading: loadingGarments } = useGarments();
  const createMutation = useCreateOrder();

  const [step, setStep] = useState(0); // Carbon ProgressIndicator is 0-indexed
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [garmentCatalogId, setGarmentCatalogId] = useState<number | null>(null);
  const [fabricId, setFabricId] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(1000);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!customerId || !garmentCatalogId) return;
    try {
      const res = await createMutation.mutateAsync({
        customerId,
        deliveryDate,
        advancePaid,
        items: [{ garmentCatalogId, fabricId: fabricId || null, quantity: 1, measurementId: null }]
      });
      history.replace(`/orders/${res.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const isNextDisabled = () => {
    if (step === 0) return !customerId;
    if (step === 1) return !garmentCatalogId;
    return false;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={() => history.push('/orders')} iconDescription="Back" hasIconOnly />
        <h2 style={{ marginLeft: '1rem' }}>New Order</h2>
      </div>

      <ProgressIndicator currentIndex={step} style={{ marginBottom: '2rem' }}>
        <ProgressStep label="Customer" />
        <ProgressStep label="Garment" />
        <ProgressStep label="Fabric" />
        <ProgressStep label="Payment" />
        <ProgressStep label="Review" />
      </ProgressIndicator>

      <Tile>
        {/* Step 0: Customer */}
        {step === 0 && (
          <Stack gap={5}>
            <h3>Select Customer</h3>
            {loadingCustomers ? <InlineLoading /> : (
              <Select
                id="customer-select"
                labelText="Customer"
                value={customerId ?? ''}
                onChange={(e) => setCustomerId(Number(e.target.value))}
              >
                <SelectItem value="" text="Select Customer" hidden />
                {customers?.map(c => (
                  <SelectItem key={c.id} value={c.id} text={`${c.name} (${c.phone})`} />
                ))}
              </Select>
            )}
          </Stack>
        )}

        {/* Step 1: Garment */}
        {step === 1 && (
          <Stack gap={5}>
            <h3>Garment Details</h3>
            {loadingGarments ? <InlineLoading /> : (
              <Select
                id="garment-select"
                labelText="Garment Type"
                value={garmentCatalogId ?? ''}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setGarmentCatalogId(id);
                  const g = garments?.find((g: any) => g.id === id);
                  if (g && totalAmount === 1000) setTotalAmount(g.basePrice);
                }}
              >
                <SelectItem value="" text="Select Garment" hidden />
                {garments?.map((g: any) => (
                  <SelectItem key={g.id} value={g.id} text={`${g.name} (₹${g.basePrice})`} />
                ))}
              </Select>
            )}
          </Stack>
        )}

        {/* Step 2: Fabric */}
        {step === 2 && (
          <Stack gap={5}>
            <h3>Select Fabric</h3>
            {loadingInventory ? <InlineLoading /> : (
              <Select
                id="fabric-select"
                labelText="Fabric"
                value={fabricId ?? ''}
                onChange={(e) => setFabricId(Number(e.target.value))}
              >
                <SelectItem value="" text="Customer's own fabric (None)" />
                {inventory?.map((f: any) => (
                  <SelectItem key={f.id} value={f.id} text={`${f.name} (${f.quantityAvailable}m left)`} />
                ))}
              </Select>
            )}
          </Stack>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Stack gap={5}>
            <h3>Delivery & Payment</h3>
            <TextInput
              id="delivery-date"
              type="date"
              labelText="Delivery Date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <TextInput
              id="total-amount"
              type="number"
              labelText="Total Amount (₹)"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
            />
            <TextInput
              id="advance-paid"
              type="number"
              labelText="Advance Paid (₹)"
              value={advancePaid}
              onChange={(e) => setAdvancePaid(Number(e.target.value))}
            />
          </Stack>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Stack gap={5}>
            <h3>Review & Confirm</h3>
            <p><strong>Customer:</strong> {customers?.find((c: any) => c.id === customerId)?.name}</p>
            <p><strong>Garment:</strong> {garments?.find((g: any) => g.id === garmentCatalogId)?.name}</p>
            <p><strong>Fabric:</strong> {inventory?.find((f: any) => f.id === fabricId)?.name || 'None'}</p>
            <p><strong>Delivery:</strong> {deliveryDate}</p>
            <p><strong>Total:</strong> ₹{totalAmount} | <strong>Advance:</strong> ₹{advancePaid}</p>

            {createMutation.isError && (
              <InlineNotification kind="error" title="Error" subtitle="Failed to create order." />
            )}
          </Stack>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button kind="secondary" onClick={handlePrev} disabled={step === 0 || createMutation.isPending}>
            Back
          </Button>
          {step < 4 ? (
            <Button renderIcon={ArrowRight} onClick={handleNext} disabled={isNextDisabled()}>
              Next
            </Button>
          ) : (
            <Button renderIcon={Checkmark} onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Confirming...' : 'Confirm Order'}
            </Button>
          )}
        </div>
      </Tile>
    </div>
  );
};

export default NewOrderPage;
