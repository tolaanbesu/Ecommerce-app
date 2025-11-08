import React from 'react';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="logo">
          <span style={{ color: 'var(--primary-green)' }}>Vibe</span> Commerce
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px' }}>
            Modern, minimal, and beautifully designed products for your home.
          </p>
        </div>
        <div className="links-group">
          <h4>Support</h4>
          <a href="#">Contact Us</a>
          <a href="#">FAQ</a>
          <a href="#">Shipping & Returns</a>
        </div>
        <div className="links-group">
          <h4>Follow Us</h4>
          <div className="social">
            {/* Mock Social Icons */}
            <i className="fa fa-facebook" style={{ marginRight: '10px' }}>f</i>
            <i className="fa fa-instagram">in</i>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <p>&copy; {currentYear} Vibe Commerce. All rights reserved.</p>
          <div>
            <a href="#">Privacy Policy</a>
            <span style={{ margin: '0 10px' }}>|</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
