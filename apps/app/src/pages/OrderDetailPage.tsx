import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Tile,
  InlineLoading,
  Button,
  Stack,
  Tag
} from '@carbon/react';
import { ArrowLeft, Checkmark } from '@carbon/icons-react';
import { useOrder, useConfirmOrder } from '../hooks/useOrders';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: order, isLoading } = useOrder(parseInt(id));
  const confirmMutation = useConfirmOrder();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'gray';
      case 'CONFIRMED': return 'blue';
      case 'CUTTING':
      case 'STITCHING': return 'warm-gray';
      case 'QUALITY_CHECK': return 'purple';
      case 'READY':
      case 'DELIVERED': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={() => history.push('/orders')} iconDescription="Back" hasIconOnly />
        <h2 style={{ marginLeft: '1rem' }}>{order?.orderNumber ?? 'Loading...'}</h2>
      </div>

      {isLoading ? <InlineLoading description="Loading order details..." /> : order ? (
        <Stack gap={5}>
          {/* Header Tile */}
          <Tile>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{order.orderNumber}</h3>
              <Tag type={getStatusColor(order.status)}>{order.status}</Tag>
            </div>
            <Stack gap={2}>
              <p><strong>Customer:</strong> {order.customer.name}</p>
              <p><strong>Booking Date:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
              <p>
                <strong>Delivery Date:</strong>{' '}
                <span style={{ color: order.deliveryDate < new Date().toISOString().split('T')[0] ? '#da1e28' : '#24a148' }}>
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </span>
              </p>
            </Stack>
          </Tile>

          {/* Financials Tile */}
          <Tile>
            <h4 style={{ marginBottom: '1rem', textTransform: 'uppercase', color: '#525252' }}>Payment Details</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Total Amount</span>
              <strong>₹{order.totalAmount.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Advance Paid</span>
              <strong style={{ color: '#24a148' }}>₹{order.advancePaid.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <span>Balance Due</span>
              <strong style={{ color: '#da1e28', fontSize: '1.2rem' }}>
                ₹{(order.totalAmount - order.advancePaid).toLocaleString()}
              </strong>
            </div>
          </Tile>

          {/* Actions */}
          {order.status === 'DRAFT' && (
            <Button
              renderIcon={Checkmark}
              onClick={() => confirmMutation.mutate(order.id)}
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending ? 'Confirming...' : 'Confirm Order & Start Production'}
            </Button>
          )}
        </Stack>
      ) : (
        <p>Order not found.</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
