import React, { useState } from 'react';
import '../styles/admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    weight: '',
    stockStatus: 'In Stock',
    image: '',
    updates: ''
  });
  const [orders, setOrders] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter(u => u.id !== id));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Remove this product from inventory?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const isEdit = !!currentProduct;
    const url = isEdit 
      ? `http://localhost:8080/api/products/${currentProduct.id}`
      : 'http://localhost:8080/api/products';
    
    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      
      if (response.ok) {
        fetchProducts();
        setShowEditor(false);
        setProductForm({ name: '', price: '', weight: '', stockStatus: 'In Stock', image: '', updates: '' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const openEditor = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setProductForm({
        name: product.name,
        price: product.price,
        weight: product.weight || '',
        stockStatus: product.stockStatus || 'In Stock',
        image: product.image || '',
        updates: product.updates || ''
      });
    } else {
      setCurrentProduct(null);
      setProductForm({ name: '', price: '', weight: '', stockStatus: 'In Stock', image: '', updates: '' });
    }
    setShowEditor(true);
  };

  const renderOrders = () => (
    <div className="admin-view fade-in">
      <div className="section-header">
        <h2>Order Management</h2>
        <span className="count-badge">{orders.length} Total</span>
      </div>
      <table className="admin-table orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Delivery Address</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6">Loading orders...</td></tr>
          ) : orders.length === 0 ? (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No orders found in database</td></tr>
          ) : orders.map((order) => (
            <tr key={order.id}>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main">#{order.id}</span>
                  <span className="cell-sub">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main">{order.fullName}</span>
                  <span className="cell-sub">Ph: {order.phone}</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main" title={order.address}>{order.address.substring(0, 30)}...</span>
                  <span className="cell-sub">{order.city} - {order.pincode}</span>
                </div>
              </td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-main">₹{order.totalAmount}</span>
                  <span className="cell-sub">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</span>
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
        <span className="count-badge">{products.length} Items</span>
      </div>
      <table className="admin-table products-table">
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
          {loading ? (
            <tr><td colSpan="5">Loading inventory...</td></tr>
          ) : products.map((p) => (
            <tr key={p.id}>
              <td className="product-img-cell">
                <div className="cell-stacked-horizontal">
                  <img src={p.image || 'https://via.placeholder.com/50'} alt={p.name} className="admin-thumbnail" />
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
                  <span className={`status-badge ${p.stockStatus === 'Out of Stock' ? 'out' : 'good'}`}>
                    {p.stockStatus}
                  </span>
                  <span className="cell-sub">{p.updates || 'No recent updates'}</span>
                </div>
              </td>
              <td>
                <div className="cell-actions">
                  <button className="icon-btn edit" title="Update Product" onClick={() => openEditor(p)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button className="icon-btn delete" title="Remove Product" onClick={() => handleDeleteProduct(p.id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="section-footer">
         <button className="primary-btn sm" onClick={() => openEditor()}>+ Add New Product</button>
      </div>

      {showEditor && (
        <div className="modal-overlay">
          <div className="modal-content admin-modal">
            <h3>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    value={productForm.price} 
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Weight (e.g. 500g)</label>
                  <input 
                    type="text" 
                    value={productForm.weight} 
                    onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Stock Status</label>
                <select 
                  value={productForm.stockStatus} 
                  onChange={(e) => setProductForm({...productForm, stockStatus: e.target.value})}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Low Stock">Low Stock</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL (Google Drive/Link)</label>
                <input 
                  type="text" 
                  value={productForm.image} 
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Updates/Notes</label>
                <input 
                  type="text" 
                  value={productForm.updates} 
                  onChange={(e) => setProductForm({...productForm, updates: e.target.value})}
                  placeholder="e.g. Freshly packed"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowEditor(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="admin-view fade-in">
      <div className="section-header">
        <h2>User Management</h2>
        <span className="count-badge">{users.length} Users</span>
      </div>
      <table className="admin-table users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Account Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5">Loading users...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan="5">No users found.</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td><span className="cell-sub">#{user.id}</span></td>
                <td>
                  <div className="cell-stacked">
                    <span className="cell-main">{user.firstName} {user.lastName}</span>
                    <span className="cell-sub">Customer</span>
                  </div>
                </td>
                <td><span className="cell-main">{user.email}</span></td>
                <td>
                  <div className="cell-stacked">
                    <span className="cell-main">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Join Date Hidden'}
                    </span>
                    <span className="cell-sub">
                      {user.createdAt ? new Date(user.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </td>
                <td>
                  <button 
                    className="icon-btn delete" 
                    title="Remove User"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'orders': return renderOrders();
      case 'products': return renderProducts();
      case 'users': return renderUsers();
      default: return renderOrders();
    }
  };

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
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span>👥</span> Users
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn">Log Out</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
