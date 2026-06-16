import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { sunnyOutline, moonOutline } from 'ionicons/icons';
import { useUiStore } from '../stores/uiStore';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useUiStore();
  return (
    <IonButton fill="clear" onClick={toggleTheme} id="theme-toggle-btn">
      <IonIcon slot="icon-only" icon={theme === 'dark' ? sunnyOutline : moonOutline} />
    </IonButton>
  );
};

export default ThemeToggle;
