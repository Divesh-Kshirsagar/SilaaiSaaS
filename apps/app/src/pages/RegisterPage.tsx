import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Form,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
  Link
} from '@carbon/react';
import { useAuthStore } from '../stores/authStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ shopName: '', ownerName: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Register Shop</h1>
      <p style={{ marginBottom: '2rem' }}>
        Already registered? <Link href="/login" onClick={(e) => { e.preventDefault(); history.push('/login'); }}>Sign in</Link>
      </p>

      {error && (
        <InlineNotification
          kind="error"
          title="Registration Failed"
          subtitle={error}
          style={{ marginBottom: '2rem' }}
        />
      )}

      <Form onSubmit={handleRegister}>
        <Stack gap={5}>
          <TextInput id="shopName" labelText="Shop Name" placeholder="e.g. Ramesh Tailors" value={form.shopName} onChange={handleChange} required />
          <TextInput id="ownerName" labelText="Your Name (Owner)" placeholder="e.g. Ramesh Kumar" value={form.ownerName} onChange={handleChange} required />
          <TextInput id="phone" labelText="Phone Number" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} required />
          <PasswordInput id="password" labelText="Password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
          <PasswordInput id="confirm" labelText="Confirm Password" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />
          <Button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Creating Account...' : 'Create Shop & Sign In'}
          </Button>
        </Stack>
      </Form>
    </div>
  );
};

export default RegisterPage;
