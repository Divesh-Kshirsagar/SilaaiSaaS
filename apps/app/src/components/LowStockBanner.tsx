import React from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import { warningOutline } from 'ionicons/icons';

interface Props { count: number; }

const LowStockBanner: React.FC<Props> = ({ count }) => {
  if (count === 0) return null;
  return (
    <div className="low-stock-banner fade-in-up">
      <IonChip color="danger" style={{ margin: 0 }}>
        <IonIcon icon={warningOutline} />
        &nbsp;{count} fabric{count > 1 ? 's' : ''} running low on stock
      </IonChip>
    </div>
  );
};

export default LowStockBanner;
