import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { auth } from '../../lib/api';
import { useT } from '../../lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const tr = useT(router.locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await auth.login(email, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      const axios = (await import('axios')).default;
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <h2>{tr('common.login')}</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>Login</button>
        </form>
      </div>
    </Layout>
  );
}
