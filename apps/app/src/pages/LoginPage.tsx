import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton,
  IonSpinner, IonText, IonIcon, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonNote, IonRouterLink,
} from '@ionic/react';
import { cutOutline, lockClosedOutline, callOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useUiStore, applyTheme } from '../stores/uiStore';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useLogin();

  // Restore theme on mount
  React.useEffect(() => {
    applyTheme(useUiStore.getState().theme);
  }, []);

  const handleLogin = async () => {
    if (!phone || !password) { setError('Phone and password are required.'); return; }
    setError('');
    try {
      await login.mutateAsync({ phone, password });
      history.replace('/dashboard');
    } catch {
      setError('Invalid phone number or password.');
    }
  };

  return (
    <IonPage id="login-page">
      <IonContent className="ion-padding">

        {/* Logo */}
        <div className="ion-text-center ion-padding-top ion-padding-bottom">
          <IonIcon icon={cutOutline} color="primary" style={{ fontSize: '56px' }} />
          <h1 className="ion-no-margin">
            Silaai<span style={{ color: 'var(--ion-color-primary)' }}>SaaS</span>
          </h1>
          <IonNote>Tailoring management, simplified.</IonNote>
        </div>

        {/* Login card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Sign In</IonCardTitle>
            <IonCardSubtitle>Enter your shop credentials</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonItem>
              <IonIcon slot="start" icon={callOutline} />
              <IonLabel position="stacked">Phone Number</IonLabel>
              <IonInput
                id="login-phone"
                type="tel"
                value={phone}
                placeholder="e.g. 9999999999"
                onIonInput={(e) => setPhone(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonIcon slot="start" icon={lockClosedOutline} />
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                id="login-password"
                type="password"
                value={password}
                placeholder="Enter password"
                onIonInput={(e) => setPassword(e.detail.value!)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="ion-padding-start">{error}</p>
              </IonText>
            )}

            <IonButton
              id="login-btn"
              expand="block"
              color="primary"
              className="ion-margin-top"
              onClick={handleLogin}
              disabled={login.isPending}
            >
              {login.isPending ? <IonSpinner name="crescent" /> : 'Sign In'}
            </IonButton>

            <div className="ion-text-center ion-margin-top">
              <IonNote>New shop? </IonNote>
              <IonRouterLink routerLink="/register" color="primary">
                Register here →
              </IonRouterLink>
            </div>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
