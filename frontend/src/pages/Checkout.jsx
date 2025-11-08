import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api';
import { FaLock } from 'react-icons/fa';
import '../../styles/checkout.css';

const Checkout = ({ onCheckoutSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', emailAddress: '' });
    const [cart, setCart] = useState({ items: [], summary: {} });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [receipt, setReceipt] = useState(null);

    const fetchCart = useCallback(async () => {
    try {
        const response = await api.getCart();
        setCart(response.data);
    } catch (error) {
        console.error('Error fetching cart:', error);
    } finally {
        setLoading(false);
    }
}, []);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.checkout(formData);
            setReceipt(response.data);
            setIsModalOpen(true);
            onCheckoutSuccess();
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        } finally { setLoading(false); }
    };

    const closeModalAndNavigate = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    const OrderConfirmationModal = ({ receipt, closeModal }) => (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={closeModal} className="close-button">&times;</button>
                <div className="success-icon"><div className="checkmark">&#10003;</div></div>
                <h2 className="thank-you">Thank You!</h2>
                <p className="confirmation-text">
                    Your order has been placed successfully. A confirmation email has been sent to your address.
                </p>
                <div className="receipt-summary">
                    <div className="receipt-row"><span>Order Number</span><span>#{receipt.orderNumber}</span></div>
                    <div className="receipt-row"><span>Date & Time</span><span>{receipt.date}, {receipt.time}</span></div>
                    <div className="receipt-row"><span>Total Paid</span><span style={{ fontWeight: 600 }}>${receipt.totalPaid}</span></div>
                </div>
                <button onClick={closeModalAndNavigate} className="continue-shopping-btn-modal">
                    Continue Shopping
                </button>
            </div>
        </div>
    );

    if (loading && !isModalOpen) return <p className="container">Loading checkout...</p>;

    return (
        <div className="container checkout-page">
            <div className="page-header">
                <h1 className="page-title">Checkout</h1>
                <Link to="/cart" className="back-to-cart">&larr; Back to Cart</Link>
            </div>

            <div className="checkout-layout">
                <div className="form-container">
                    <h2 className="section-title">Contact Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailAddress">Email Address</label>
                            <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} placeholder="Enter your email address" required />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>Confirm Purchase</button>
                        <p className="ssl-text"><FaLock style={{ marginRight: 5 }} /> Secure SSL Encryption</p>
                    </form>
                </div>

                <div className="summary-card">
                    <h2 className="section-title">Order Summary</h2>
                    {cart.items.map(item => (
                        <div key={item._id} className="cart-item-summary-row">
                            <div className="product-info">
                                <div className="product-image"></div>
                                <div>
                                    <p className="product-name">{item.productId.name}</p>
                                    <p className="product-qty">Quantity: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="product-price">
                                ${(item.productId.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                    <div className="summary-details">
                        <div className="summary-detail-row">
                            <p>Subtotal</p><p>${cart.summary.subtotal || '0.00'}</p>
                        </div>
                        <div className="summary-detail-row">
                            <p>Shipping</p><p>{cart.summary.shipping > 0 ? `$${cart.summary.shipping}` : 'Free'}</p>
                        </div>
                        <div className="divider"></div>
                        <div className="total-row">
                            <p>Total</p><p>${cart.summary.total || '0.00'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && receipt && <OrderConfirmationModal receipt={receipt} closeModal={closeModalAndNavigate} />}
        </div>
    );
};

export default Checkout;
