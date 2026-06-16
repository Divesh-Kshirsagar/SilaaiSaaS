import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Tile,
  InlineLoading,
  Button,
  Stack,
  Tag
} from '@carbon/react';
import { ArrowLeft } from '@carbon/icons-react';
import { api } from '../lib/api';
import { CustomerSchema, MeasurementSchema } from '../schemas/customer';
import { z } from 'zod';

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = parseInt(id);
  const history = useHistory();

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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={() => history.push('/customers')} iconDescription="Back" hasIconOnly />
        <h2 style={{ marginLeft: '1rem' }}>{loadingCustomer ? 'Loading...' : customer?.name}</h2>
      </div>

      <Tile style={{ marginBottom: '2rem' }}>
        {loadingCustomer ? <InlineLoading /> : (
          <Stack gap={2}>
            <h3>{customer?.name}</h3>
            <p style={{ color: '#525252' }}>{customer?.phone}</p>
          </Stack>
        )}
      </Tile>

      <h3 style={{ marginBottom: '1rem' }}>Measurements</h3>
      
      {loadingMeasurements ? <InlineLoading /> : measurements?.length ? (
        <Stack gap={4}>
          {measurements.map(m => (
            <Tile key={m.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{m.garmentType}</h4>
                <Tag type="blue">{new Date(m.updatedAt).toLocaleDateString()}</Tag>
              </div>
              <p>
                {[
                  m.chest && `Chest: ${m.chest}"`,
                  m.waist && `Waist: ${m.waist}"`,
                  m.length && `Length: ${m.length}"`,
                ].filter(Boolean).join('  •  ')}
              </p>
              {m.notes && <p style={{ marginTop: '0.5rem', color: '#525252' }}>{m.notes}</p>}
            </Tile>
          ))}
        </Stack>
      ) : (
        <p>No measurements recorded yet.</p>
      )}
    </div>
  );
};

export default CustomerDetailPage;
