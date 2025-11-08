import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductListing from './pages/ProductListing';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import * as api from './api';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] =useState('');

  const fetchCartCount = async () => {
    try {
      const response = await api.getCart();
      const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <Router>
      <Header cartCount={cartCount} onSearch={setSearchQuery}/>
      <main style={{ flex: 1, padding: '40px 0' }}>
        <Routes>
          <Route path="/" element={<ProductListing onAddToCart={fetchCartCount} searchQuery={searchQuery} />} />
          <Route path="/cart" element={<ShoppingCart onCartUpdate={fetchCartCount} />} />
          <Route path="/checkout" element={<Checkout onCheckoutSuccess={fetchCartCount} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;