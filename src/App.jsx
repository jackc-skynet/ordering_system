import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Send, CheckCircle, Clock, ChefHat, Trash2, Utensils, Star, Info, ChevronRight, Filter } from 'lucide-react';
import { MENU_DATA, CATEGORIES } from './data/menu';
import { supabase } from './lib/supabase';
import IngredientBuilder from './IngredientBuilder';

const OrderTrackingView = ({ order, onBackToMenu, onClearOrder }) => {
    // Safety check for order object
    if (!order || !order.id) {
        return (
            <div className="premium-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ padding: '2rem' }}>
                    <p>正在載入訂單資訊...</p>
                </div>
            </div>
        );
    }

    const [status, setStatus] = useState(order.initialStatus || 'pending');

    useEffect(() => {
        const channel = supabase
            .channel(`order-status-${order.id}`)
            .on('postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` }, 
                payload => {
                    if (payload.new && payload.new.status) {
                        setStatus(payload.new.status);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [order.id]);

    const stages = [
        { id: 'pending', label: '收到訂單', icon: <Clock size={24} /> },
        { id: 'preparing', label: '製作中', icon: <ChefHat size={24} /> },
        { id: 'ready', label: '可取餐！', icon: <CheckCircle size={24} /> }
    ];

    const currentStageIndex = stages.findIndex(s => s.id === status);
    const isCompleted = status === 'completed';

    return (
        <div className="premium-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="glass" style={{ padding: '3rem', maxWidth: '600px', width: '90%', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.5rem', color: isCompleted ? '#4ade80' : 'var(--primary)', display: 'flex', justifyContent: 'center' }}>
                    {isCompleted ? <CheckCircle size={80} /> : <Clock size={80} className={status === 'preparing' ? 'spin' : ''} />}
                </div>
                
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {isCompleted ? '餐點已領取！感謝光臨' : '主廚正在為您服務'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    取餐號碼：<span style={{ color: 'var(--primary)', fontWeight: 'bold', fontFamily: 'monospace' }}>{order.displayId}</span>
                </p>

                {!isCompleted && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '12px', left: '10%', right: '10%', height: '2px', background: 'var(--glass-border)', zIndex: 0 }}></div>
                        <div style={{ 
                            position: 'absolute', 
                            top: '12px', 
                            left: '10%', 
                            width: currentStageIndex >= 0 ? `${currentStageIndex * 40}%` : '0%', 
                            height: '2px', 
                            background: 'var(--primary)', 
                            zIndex: 0, 
                            transition: 'width 0.5s ease' 
                        }}></div>
                        
                        {stages.map((stage, index) => {
                            const isActive = index <= currentStageIndex;
                            const isCurrent = index === currentStageIndex;
                            return (
                                <div key={stage.id} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                    <div style={{ 
                                        width: '24px', 
                                        height: '24px', 
                                        borderRadius: '50%', 
                                        background: isCurrent ? 'var(--primary)' : (isActive ? 'var(--primary)' : 'var(--glass)'),
                                        border: `2px solid ${isActive ? 'var(--primary)' : 'var(--glass-border)'}`,
                                        boxShadow: isCurrent ? '0 0 15px var(--primary)' : 'none',
                                        transition: 'all 0.3s'
                                    }}></div>
                                    <span style={{ fontSize: '0.8rem', color: isActive ? 'white' : 'var(--text-secondary)', fontWeight: isCurrent ? 'bold' : 'normal' }}>
                                        {stage.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {status === 'ready' && (
                    <div className="glass" style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80' }}>
                        <h3 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>🎉 餐點好囉！</h3>
                        <p style={{ fontSize: '0.9rem' }}>請前往櫃檯並出示號碼 「{order.displayId}」 領取您的美味餐點。</p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="glass" style={{ flex: 1, justifyContent: 'center' }} onClick={onBackToMenu}>
                        先看菜單
                    </button>
                    {isCompleted && (
                        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClearOrder}>
                            結束並清除
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const FloatingStatusButton = ({ order, onClick }) => {
    const [status, setStatus] = useState(order.initialStatus || 'pending');

    useEffect(() => {
        const channel = supabase
            .channel(`order-status-fab-${order.id}`)
            .on('postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` }, 
                payload => {
                    if (payload.new && payload.new.status) {
                        setStatus(payload.new.status);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [order.id]);

    if (status === 'completed') return null;

    const getStatusInfo = () => {
        switch (status) {
            case 'preparing': return { color: '#f7b733', text: '製作中' };
            case 'ready': return { color: '#4ade80', text: '請取餐！' };
            default: return { color: '#ff6b35', text: '等候中' };
        }
    };

    const info = getStatusInfo();

    return (
        <button 
            className="glass" 
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '160px',
                right: '25px',
                padding: '0.8rem 1.2rem',
                borderRadius: '50px',
                border: `1px solid ${info.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                zIndex: 1000,
                boxShadow: `0 4px 15px ${info.color}44`,
                cursor: 'pointer',
                animation: status === 'ready' ? 'pulse 2s infinite' : 'none'
            }}
        >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: info.color }}></div>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{info.text} - {order.displayId}</span>
            <ChevronRight size={16} />
        </button>
    );
};

function App() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [orderResult, setOrderResult] = useState(null);
    const [showTracking, setShowTracking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const EXTENDED_CATEGORIES = [...CATEGORIES, '創意料理'];

    const filteredMenu = activeCategory === 'All'
        ? MENU_DATA
        : MENU_DATA.filter(item => item.category === activeCategory);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === id);
            if (existing.quantity === 1) {
                return prev.filter(i => i.id !== id);
            }
            return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
        });
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([
                    { items: cart, total_price: totalPrice, status: 'pending' }
                ])
                .select()
                .single();

            if (error) throw error;

            setOrderResult({
                success: true,
                id: data.id,
                displayId: (data.id || "").split('-')[0].toUpperCase(),
                initialStatus: data.status || 'pending'
            });
            setShowTracking(true);
        } catch (error) {
            console.error("Error creating order:", error);
            // Show the exact error message from Supabase to help debugging
            alert(`結帳失敗: ${error.message || JSON.stringify(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showTracking && orderResult?.success) {
        return <OrderTrackingView 
            order={orderResult} 
            onBackToMenu={() => setShowTracking(false)} 
            onClearOrder={() => { setCart([]); setOrderResult(null); setShowTracking(false); }}
        />;
    }

    return (
        <div className="premium-container" style={{ position: 'relative' }}>
            {orderResult && !showTracking && (
                <FloatingStatusButton order={orderResult} onClick={() => setShowTracking(true)} />
            )}
            {/* Header */}
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>點菜系統</h1>
                <p style={{ color: 'var(--text-secondary)' }}>探索美味與質感交織的用餐時光</p>
            </header>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
                {EXTENDED_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className="glass"
                        style={{
                            padding: '10px 24px',
                            border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                            backgroundColor: activeCategory === cat ? 'rgba(255, 107, 53, 0.1)' : 'var(--glass)',
                            color: activeCategory === cat ? 'var(--primary)' : 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cat === 'All' ? '全部餐點' :
                            cat === 'Main' ? '主食' :
                                cat === 'Appetizer' ? '開胃菜' :
                                    cat === 'Drink' ? '飲品' :
                                        cat === '創意料理' ? '🧑‍🍳 創意料理' : '甜點'}
                    </button>
                ))}
            </div>

            {/* Menu Grid / Builder */}
            {activeCategory === '創意料理' ? (
                <IngredientBuilder onAddToCart={addToCart} />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
                    {filteredMenu.map(item => (
                        <div key={item.id} className="glass" style={{ overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                            <div style={{ height: '180px', overflow: 'hidden' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '3rem' }}>{item.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>${item.price}</span>
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '8px 16px', borderRadius: '8px' }}
                                        onClick={() => addToCart(item)}
                                    >
                                        <Plus size={20} /> 加入
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sticky Cart Summary */}
            {cart.length > 0 && (
                <div className="glass" style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '600px',
                    padding: '1.5rem',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                    zIndex: 100
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingCart size={24} color="var(--primary)" />
                            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>您的餐點 ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                        </div>
                        <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>總計: ${totalPrice}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="glass"
                            style={{ padding: '0 1rem', border: '1px solid var(--glass-border)', color: '#ff4d4d' }}
                            onClick={() => { if(window.confirm("確定要清空購物車嗎？")) setCart([]); }}
                        >
                            清空
                        </button>
                        <button
                            className="btn-primary"
                            style={{ flex: 1, justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                        >
                            <Send size={20} /> {isSubmitting ? '處理中...' : '送出訂單 (現金結帳)'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
