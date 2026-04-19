import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImageSlider from './components/ImageSlider';
import PopularItems from './components/PopularItems';
import BestSelling from './components/BestSelling';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Admin from "./components/Admin.jsx";
import './styles/App.css';

// Home Component to group main page content
const Home = ({ addToCart }) => (
  <>
    <ImageSlider />
    <PopularItems />
    <BestSelling onAddToCart={addToCart} />
  </>
);

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  // State and logic moved here to support useLocation
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('manemade_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('manemade_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="App">
      <Navbar cartCount={cart.reduce((total, item) => total + item.quantity, 0)} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route 
          path="/cart" 
          element={
            <Cart 
              cart={cart} 
              removeFromCart={removeFromCart} 
              updateQuantity={updateQuantity} 
              clearCart={clearCart}
            />
          } 
        />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
