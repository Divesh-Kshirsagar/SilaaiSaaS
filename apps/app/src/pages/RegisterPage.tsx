import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonLabel, IonInput, IonButton, IonSpinner, IonText, IonCard,
  IonCardContent, IonCardHeader, IonCardTitle, IonBackButton, IonButtons,
  IonNote, IonRouterLink,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { applyTheme, useUiStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ shopName: '', ownerName: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => { applyTheme(useUiStore.getState().theme); }, []);

  const set = (field: string) => (e: any) => setForm((f) => ({ ...f, [field]: e.detail.value! }));

  const handleRegister = async () => {
    if (!form.shopName || !form.ownerName || !form.phone || !form.password) {
      setError('All fields are required.'); return;
    }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        shopName: form.shopName, ownerName: form.ownerName,
        phone: form.phone, password: form.password,
      });
      login(res.data.token, { userId: res.data.userId, name: res.data.name, role: res.data.role });
      history.replace('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Registration failed. Try a different phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage id="register-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Register Shop</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Create your shop</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>

            <IonItem>
              <IonLabel position="stacked">Shop Name</IonLabel>
              <IonInput id="reg-shop-name" placeholder="e.g. Ramesh Tailors" value={form.shopName} onIonInput={set('shopName')} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Your Name (Owner)</IonLabel>
              <IonInput id="reg-owner-name" placeholder="e.g. Ramesh Kumar" value={form.ownerName} onIonInput={set('ownerName')} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Phone Number</IonLabel>
              <IonInput id="reg-phone" type="tel" placeholder="10-digit mobile number" value={form.phone} onIonInput={set('phone')} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput id="reg-password" type="password" placeholder="Min. 8 characters" value={form.password} onIonInput={set('password')} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Confirm Password</IonLabel>
              <IonInput id="reg-confirm" type="password" placeholder="Re-enter password" value={form.confirm} onIonInput={set('confirm')} />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="ion-padding-start">{error}</p>
              </IonText>
            )}

            <IonButton
              id="register-btn"
              expand="block"
              color="primary"
              className="ion-margin-top"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'Create Shop & Sign In'}
            </IonButton>

            <div className="ion-text-center ion-margin-top">
              <IonNote>Already registered? </IonNote>
              <IonRouterLink routerLink="/login" color="primary">Sign in →</IonRouterLink>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
