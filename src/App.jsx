import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Send, Star, Clock } from 'lucide-react';
import { MENU_DATA, CATEGORIES } from './data/menu';

function App() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

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

    if (isOrderPlaced) {
        return (
            <div className="premium-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>訂單發送成功！</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>主廚已收到您的點單，正在火速製作中...</p>
                    <button className="btn-primary" onClick={() => { setCart([]); setIsOrderPlaced(false); }}>
                        回到菜單
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="premium-container">
            {/* Header */}
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>點菜系統</h1>
                <p style={{ color: 'var(--text-secondary)' }}>探索美味與質感交織的用餐時光</p>
            </header>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
                {CATEGORIES.map(cat => (
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
                                    cat === 'Drink' ? '飲品' : '甜點'}
                    </button>
                ))}
            </div>

            {/* Menu Grid */}
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
                            className="btn-primary"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => setIsOrderPlaced(true)}
                        >
                            <Send size={20} /> 立即訂購
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
