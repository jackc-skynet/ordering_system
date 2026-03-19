import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { CheckCircle, Clock, ChefHat, Trash2 } from 'lucide-react';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Real-time subscription
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        if (payload.eventType === 'INSERT') {
          setOrders(current => [payload.new, ...current]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(current => current.map(o => o.id === payload.new.id ? payload.new : o));
        } else if (payload.eventType === 'DELETE') {
          setOrders(current => current.filter(o => o.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      // Optimistic update
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating status:', error.message);
      alert('更新狀態失敗，請稍後再試。');
    }
  };

  const deleteOrder = async (id) => {
      if(!confirm('確定要刪除這筆訂單嗎？')) return;
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting order:', error.message);
        alert('刪除失敗，請稍後再試。');
      }
    };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff6b35';
      case 'preparing': return '#f7b733';
      case 'ready': return '#4ade80';
      case 'completed': return 'var(--text-secondary)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'preparing': return '製作中';
      case 'ready': return '可取餐';
      case 'completed': return '已結案';
      default: return status;
    }
  };

  if (loading) {
     return <div className="premium-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>載入訂單中...</div>;
  }

  return (
    <div className="premium-container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>廚房後台系統</h1>
          <p style={{ color: 'var(--text-secondary)' }}>即時訂單管理面板</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: getStatusColor('pending') }}></span>
                <span style={{ fontSize: '0.9rem' }}>待處理</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: getStatusColor('preparing') }}></span>
                <span style={{ fontSize: '0.9rem' }}>製作中</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: getStatusColor('ready') }}></span>
                <span style={{ fontSize: '0.9rem' }}>請取餐</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: getStatusColor('completed') }}></span>
                <span style={{ fontSize: '0.9rem' }}>已結案</span>
            </div>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>目前沒有訂單</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {orders.map(order => (
            <div key={order.id} className="glass" style={{ 
                padding: '1.5rem', 
                borderTop: `4px solid ${getStatusColor(order.status)}`,
                position: 'relative'
            }}>
                <button 
                  onClick={() => deleteOrder(order.id)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  title="刪除訂單"
                >
                    <Trash2 size={20} />
                </button>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    訂單時間: {new Date(order.created_at).toLocaleTimeString()}
                </div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    ID: {order.id.split('-')[0].toUpperCase()}
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem', minHeight: '120px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <span style={{ fontWeight: '600' }}>總計:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>${order.total_price}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {order.status === 'pending' && (
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#f7b733' }} onClick={() => updateStatus(order.id, 'preparing')}>
                    <ChefHat size={18} /> 開始製作
                  </button>
                )}
                {order.status === 'preparing' && (
                   <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#4ade80' }} onClick={() => updateStatus(order.id, 'ready')}>
                    <CheckCircle size={18} /> 製作完成 (通知取餐)
                 </button>
                )}
                {order.status === 'ready' && (
                   <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'var(--text-secondary)' }} onClick={() => updateStatus(order.id, 'completed')}>
                    <CheckCircle size={18} /> 客戶已取餐 (結案)
                 </button>
                )}
                 {order.status === 'completed' && (
                   <div style={{ flex: 1, textAlign: 'center', padding: '12px', color: 'var(--text-secondary)', fontWeight: '600', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                     訂單已完成結案
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
