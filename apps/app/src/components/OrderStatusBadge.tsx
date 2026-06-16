import React from 'react';
import { IonBadge } from '@ionic/react';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from '../constants/enums';

interface Props { status: OrderStatus; }

const OrderStatusBadge: React.FC<Props> = ({ status }) => (
  <IonBadge color={ORDER_STATUS_COLORS[status]} style={{ borderRadius: 6, fontSize: '0.7rem' }}>
    {ORDER_STATUS_LABELS[status]}
  </IonBadge>
);

export default OrderStatusBadge;
