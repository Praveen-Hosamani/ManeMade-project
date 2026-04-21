import React, { useState, useEffect } from 'react';
import '../styles/myOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(() => {
        const savedUser = localStorage.getItem('manemade_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user && user.email) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = () => {
        setLoading(true);
        fetch(`http://localhost:8080/api/orders/user/${user.email}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch orders');
                return res.json();
            })
            .then(data => {
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching orders:', err);
                setError(err.message);
                setLoading(false);
            });
    };

    const handleDeleteOrder = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order from your history?')) {
            fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'DELETE',
            })
            .then(res => {
                if (res.ok) {
                    setOrders(prev => prev.filter(order => order.id !== orderId));
                    alert('Order deleted successfully');
                } else {
                    alert('Failed to delete order. Please try again.');
                }
            })
            .catch(err => {
                console.error('Error deleting order:', err);
                alert('Connection error. Could not delete order.');
            });
        }
    };

    if (!user) {
        return (
            <div className="orders-container">
                <div className="orders-empty">
                    <h2>Please login to view your orders</h2>
                </div>
            </div>
        );
    }

    if (loading) return <div className="orders-container loading">Loading your orders...</div>;
    if (error) return <div className="orders-container error">{error}</div>;

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>Track and manage your recent purchases</p>
            </div>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <h3>No orders yet</h3>
                    <p>When you buy items, they will appear here.</p>
                    <button className="shop-now-btn" onClick={() => window.location.href = '/'}>Shop Now</button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-main">
                                <div className="order-info">
                                    <div className="order-meta">
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="order-status-and-actions">
                                        <div className="order-status-badge" data-status={order.status.toLowerCase()}>
                                            {order.status}
                                        </div>
                                        <button className="delete-order-btn" onClick={() => handleDeleteOrder(order.id)} title="Delete Order">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M3 6h18"></path>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="order-total">
                                    <label>Total Amount</label>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="order-items-preview">
                                {order.items && order.items.map(item => (
                                    <div key={item.id} className="order-item-row">
                                        <div className="item-main-info">
                                            <img src={item.product.image} alt={item.product.name} className="order-item-img" />
                                            <div className="item-details">
                                                <span className="item-name">{item.product.name}</span>
                                                <span className="item-qty">Quantity: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <span className="item-price">₹{item.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="shipping-info">
                                    <label>Shipping Address:</label>
                                    <p>{order.fullName}<br/>{order.address}, {order.city} - {order.pincode}</p>
                                </div>
                                <div className="footer-actions">
                                    <button className="track-btn">Track Order</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
