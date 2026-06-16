import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton,
  IonSpinner, IonText, IonIcon,
} from '@ionic/react';
import { lockClosedOutline, callOutline, cutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const loginMutation = useLogin();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await loginMutation.mutateAsync({ phone, password });
      history.replace('/dashboard');
    } catch {
      setError('Invalid phone number or password. Please try again.');
    }
  };

  return (
    <IonPage id="login-page">
      <IonContent fullscreen style={{ '--background': 'var(--ion-background-color)' }}>
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '24px',
          background: 'radial-gradient(ellipse at top left, rgba(124,95,255,0.15) 0%, transparent 60%), var(--ion-background-color)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 48 }} className="fade-in-up">
            <div style={{
              width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-tertiary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(124,95,255,0.4)',
            }}>
              <IonIcon icon={cutOutline} style={{ fontSize: 36, color: '#fff' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              Silaai<span style={{ color: 'var(--ion-color-primary)' }}>SaaS</span>
            </h1>
            <p style={{ margin: '8px 0 0', color: 'var(--ion-color-medium)', fontSize: '0.9rem' }}>
              Tailoring, simplified.
            </p>
          </div>

          {/* Card */}
          <div className="silaai-card fade-in-up" style={{
            width: '100%', maxWidth: 400, padding: 28,
            background: 'var(--silaai-surface)',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: 24, fontSize: '1.3rem' }}>Welcome back</h2>

            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px', marginBottom: 14 }}>
              <IonIcon slot="start" icon={callOutline} color="primary" />
              <IonLabel position="floating">Phone Number</IonLabel>
              <IonInput
                id="login-phone"
                type="tel"
                value={phone}
                onIonChange={(e) => setPhone(e.detail.value!)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </IonItem>

            <IonItem style={{ '--background': 'var(--silaai-surface-2)', '--border-radius': '10px', marginBottom: 24 }}>
              <IonIcon slot="start" icon={lockClosedOutline} color="primary" />
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                id="login-password"
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p style={{ fontSize: '0.85rem', marginTop: 0, marginBottom: 16 }}>{error}</p>
              </IonText>
            )}

            <IonButton
              id="login-submit-btn"
              expand="block"
              className="btn-gradient"
              onClick={handleLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <IonSpinner name="crescent" /> : 'Sign In'}
            </IonButton>
          </div>

          <p style={{ marginTop: 32, fontSize: '0.75rem', color: 'var(--ion-color-medium)' }}>
            SilaaiSaaS © {new Date().getFullYear()}
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
