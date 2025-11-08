import React, {useState, useEffect} from 'react';
import { Link} from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaLeaf } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import Profile from './Profile';
import { getUser } from '../api';
import './header.css';

const Header = ({ cartCount, onSearch }) => {
  
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    getUser()
      .then(res => setUser(res.data))
      .catch(err => console.error('Failed to fetch user:', err));
  }, []);

  const handleSearchChange = (e) => {
    onSearch(e.target.value)
  };

  return (
    <header className="header">
      <div className="container header-container">
        {/* LOGO */}
        <div className="logo">
          <FaLeaf className="logo-icon" />
          <Link to="/" className="logo-text">Vibe Commerce</Link>
        </div>

        {/* NAVIGATION */}
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/?category=All">Shop</Link>
          <Link to="/?category=New%20Arrivals">New Arrivals</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* SEARCH + ICONS */}
        <div className="icon-group">
          <form className="search-form">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <BsSearch />
            </button>
          </form>

          <Link to="/cart" className="cart-link">
            <FaShoppingCart className="icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <FaUserCircle className="icon" onClick={()=> setShowProfile(true)}/>
          <Link to="/login" className="login-btn">Login</Link>
        </div>

        {
          showProfile && (
            <Profile user={user} onClose={()=>setShowProfile(false)}/>
          )
        }

      </div>
    </header>
  );
};

export default Header;
