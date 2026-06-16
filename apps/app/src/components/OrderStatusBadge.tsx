import React from 'react';
import { Tag } from '@carbon/react';
import { ORDER_STATUS_LABELS } from '../constants/enums';

interface Props {
  status: string;
}

const OrderStatusBadge: React.FC<Props> = ({ status }) => {
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

  const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;

  return (
    <Tag type={getStatusColor(status)}>
      {label}
    </Tag>
  );
};

export default OrderStatusBadge;
