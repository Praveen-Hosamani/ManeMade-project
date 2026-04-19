import React, { useState } from 'react';
import { products as initialProducts } from '../data/products';
import '../styles/admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders');

  // Simulated Orders (moved from dashboard to its own section)
  const recentOrders = [
    { id: '#10234', customer: 'Rahul Sharma', date: 'Oct 12, 2023', amount: '₹1,250', status: 'Delivered' },
    { id: '#10235', customer: 'Priya Singh', date: 'Oct 12, 2023', amount: '₹450', status: 'Processing' },
    { id: '#10236', customer: 'Amit Patel', date: 'Oct 11, 2023', amount: '₹2,300', status: 'Shipped' },
    { id: '#10237', customer: 'Sneha Rao', date: 'Oct 11, 2023', amount: '₹890', status: 'Pending' },
    { id: '#10238', customer: 'Kiran K.', date: 'Oct 10, 2023', amount: '₹1,500', status: 'Delivered' },
    { id: '#10239', customer: 'Sunita M.', date: 'Oct 10, 2023', amount: '₹670', status: 'Processing' },
  ];

  const renderOrders = () => (
    <div className="admin-view fade-in">
      <div className="section-header">
        <h2>Order Management</h2>
      </div>
      <table className="admin-table orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.id}>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main">{order.id}</span>
                  <span className="cell-sub">{order.date}</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main">{order.customer}</span>
                  <span className="cell-sub">Ph: +91 98765 43210</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main">{order.date}</span>
                  <span className="cell-sub">10:30 AM</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main">{order.amount}</span>
                  <span className="cell-sub">Cash on Delivery</span>
                </div>
              </td>
              <td>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td><button className="action-btn">Manage</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProducts = () => (
    <div className="admin-view fade-in">
      <div className="section-header centered">
        <h2>Inventory Management</h2>
      </div>
      <table className="admin-table products-table">
        {/* ... table content remains same ... */}
        <thead>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {initialProducts.map((p) => (
            <tr key={p.id}>
              <td className="product-img-cell">
                <div className="cell-stacked-horizontal">
                  <img src={p.image} alt={p.name} className="admin-thumbnail" />
                  <span className="cell-sub">#{p.id}</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main p-name">{p.name}</span>
                  <span className="cell-sub p-weight">{p.weight}</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main p-price">₹{p.price}</span>
                  <span className="cell-sub">per pack</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className={`status-badge ${p.stock === 0 ? 'out' : p.stock < 10 ? 'low' : 'good'}`}>
                    {p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                  <span className="cell-sub">{p.stock} units left</span>
                </div>
              </td>
              <td>
                <div className="cell-actions">
                  <button className="icon-btn edit" title="Update Product">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button className="icon-btn delete" title="Remove Product">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="section-footer">
         <button className="primary-btn sm">+ Add New Product</button>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>ManeMade Admin</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span>🛍️</span> Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span>🧴</span> Products
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn">Log Out</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">
          {activeTab === 'orders' ? renderOrders() : renderProducts()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
