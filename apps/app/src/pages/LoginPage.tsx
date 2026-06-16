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

const LoginPage: React.FC = () => {
  const history = useHistory();
  const { login } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { phone, password });
      login(res.data.token, { userId: res.data.userId, name: res.data.name, role: res.data.role });
      history.replace('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Sign in to SilaaiSaaS</h1>
      <p style={{ marginBottom: '2rem' }}>
        Don't have an account? <Link href="/register" onClick={(e) => { e.preventDefault(); history.push('/register'); }}>Register your shop</Link>
      </p>

      {error && (
        <InlineNotification
          kind="error"
          title="Login Failed"
          subtitle={error}
          style={{ marginBottom: '2rem' }}
        />
      )}

      <Form onSubmit={handleLogin}>
        <Stack gap={5}>
          <TextInput
            id="login-phone"
            labelText="Phone Number"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <PasswordInput
            id="login-password"
            labelText="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Stack>
      </Form>
    </div>
  );
};

export default LoginPage;
