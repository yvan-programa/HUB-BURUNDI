// pages/dashboard/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { events, shopping, payments } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ticketsRes, ordersRes, paymentsRes] = await Promise.all([
        events.getMyTickets().catch(() => ({ data: [] })),
        shopping.getOrders().catch(() => ({ data: [] })),
        payments.getHistory().catch(() => ({ data: [] }))
      ]);

      setMyTickets(ticketsRes.data);
      setMyOrders(ordersRes.data);
      setPaymentHistory(paymentsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="loader" style={{ width: '40px', height: '40px' }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ background: 'var(--secondary-color)', padding: '3rem 0' }}>
        <div className="container">
          <h1>My Dashboard</h1>
          <p>Manage your tickets, orders, and account</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎫</div>
            <h3>{myTickets.length}</h3>
            <p style={{ color: 'var(--muted-text-color)' }}>My Tickets</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
            <h3>{myOrders.length}</h3>
            <p style={{ color: 'var(--muted-text-color)' }}>My Orders</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
            <h3>{paymentHistory.length}</h3>
            <p style={{ color: 'var(--muted-text-color)' }}>Payments</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div className="card">
            <h2>My Tickets</h2>
            {myTickets.length === 0 ? (
              <p style={{ color: 'var(--muted-text-color)', marginTop: '1rem' }}>
                No tickets yet. <a href="/events" style={{ color: 'var(--primary-color)' }}>Browse events</a>
              </p>
            ) : (
              <div style={{ marginTop: '1rem' }}>
                {myTickets.slice(0, 3).map((ticket: any) => (
                  <div 
                    key={ticket.id}
                    style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <h4>{ticket.event?.title || 'Event'}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted-text-color)', marginTop: '0.25rem' }}>
                      {new Date(ticket.event?.start_at).toLocaleDateString()} • {ticket.holder_name}
                    </p>
                    {ticket.qr_code && (
                      <img 
                        src={ticket.qr_code} 
                        alt="QR Code" 
                        style={{ width: '80px', height: '80px', marginTop: '0.5rem' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2>Recent Orders</h2>
            {myOrders.length === 0 ? (
              <p style={{ color: 'var(--muted-text-color)', marginTop: '1rem' }}>
                No orders yet. <a href="/shopping" style={{ color: 'var(--primary-color)' }}>Start shopping</a>
              </p>
            ) : (
              <div style={{ marginTop: '1rem' }}>
                {myOrders.slice(0, 3).map((order: any) => (
                  <div 
                    key={order.id}
                    style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>Order #{order.id.substring(0, 8)}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--muted-text-color)', marginTop: '0.25rem' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 600 }}>
                          {(order.total_cents / 100).toLocaleString()} BIF
                        </p>
                        <span 
                          className={`badge badge-${
                            order.status === 'delivered' ? 'success' :
                            order.status === 'cancelled' ? 'danger' :
                            'warning'
                          }`}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2>Payment History</h2>
          {paymentHistory.length === 0 ? (
            <p style={{ color: 'var(--muted-text-color)', marginTop: '1rem' }}>
              No payment history
            </p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Method</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment: any) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                        {payment.method}
                      </td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                        {payment.method.replace('_', ' ')}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                        {(payment.amount_cents / 100).toLocaleString()} {payment.currency}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span 
                          className={`badge badge-${
                            payment.status === 'completed' ? 'success' :
                            payment.status === 'failed' ? 'danger' :
                            'warning'
                          }`}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
