import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { events, shopping, payments } from '../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ticketsRes] = await Promise.all([events.getMyTickets()]);
      setTickets(ticketsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Tableau de bord</h1>
        {user && <p>Bienvenue, {user.full_name}</p>}
      </div>
    </Layout>
  );
}
