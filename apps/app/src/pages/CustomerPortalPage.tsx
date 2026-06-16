import React, { useState } from 'react';
import {
  ProgressIndicator,
  ProgressStep,
  TextInput,
  Button,
  Tile,
  InlineLoading,
  Stack
} from '@carbon/react';
import { Search } from '@carbon/icons-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

const CustomerPortalPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const statusTimeline = ['DRAFT', 'CONFIRMED', 'CUTTING', 'STITCHING', 'QUALITY_CHECK', 'READY', 'DELIVERED'];
  const currentIndex = order ? statusTimeline.indexOf(order.status) : -1;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Track Your Order</h1>
        <p>Enter your tracking number below</p>
      </div>

      <Tile style={{ marginBottom: '2rem' }}>
        <Stack gap={5}>
          <TextInput
            id="order-search"
            labelText="Order Number"
            placeholder="e.g. ORD-1"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Button renderIcon={Search} onClick={handleSearch} disabled={loading || !orderNumber}>
            {loading ? 'Tracking...' : 'Track Order'}
          </Button>
          {error && <p style={{ color: '#da1e28' }}>{error}</p>}
        </Stack>
      </Tile>

      {loading && <InlineLoading description="Fetching order details..." />}

      {order && (
        <Tile>
          <h2 style={{ marginBottom: '1rem' }}>Order {order.orderNumber}</h2>
          <Stack gap={3} style={{ marginBottom: '2rem' }}>
            <p><strong>Customer Name:</strong> {order.customerName}</p>
            <p><strong>Expected Delivery:</strong> {order.deliveryDate}</p>
            <p><strong>Payment Status:</strong> Total: ₹{order.totalAmount} | Paid: ₹{order.advancePaid}</p>
          </Stack>

          <h3>Status Timeline</h3>
          <ProgressIndicator vertical currentIndex={currentIndex} style={{ marginTop: '1rem' }}>
            {statusTimeline.map((step, idx) => (
              <ProgressStep
                key={step}
                label={step.replace(/_/g, ' ')}
                complete={idx < currentIndex}
                current={idx === currentIndex}
                disabled={idx > currentIndex}
              />
            ))}
          </ProgressIndicator>
        </Tile>
      )}
    </div>
  );
};

export default CustomerPortalPage;
