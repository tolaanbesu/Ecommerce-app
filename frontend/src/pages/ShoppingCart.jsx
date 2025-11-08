import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import * as api from '../api';
import '../../styles/shoppingCart.css';

const ShoppingCart = ({ onCartUpdate }) => {
    const [cart, setCart] = useState({ items: [], summary: {} });
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const response = await api.getCart();
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 0) return;

        try {
            if (newQuantity === 0) {
                await api.removeCartItem(cartItemId);
            } else {
                await api.updateCartItem(cartItemId, newQuantity);
            }
            fetchCart();
            onCartUpdate();
        } catch (error) {
            console.error('Error updating cart item:', error);
            alert('Failed to update cart.');
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await api.removeCartItem(cartItemId);
            fetchCart();
            onCartUpdate();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item.');
        }
    };

    const CartItemRow = ({ item }) => (
        <div className="item-row">
            <div className="item-details">
                <div className="item-image"></div>
                <div className="text-details">
                    <h4 className="item-title">{item.productId.name}</h4>
                    <p className="item-variant">
                        Color: {item.productId.name.includes('Pants') ? 'Khaki' : 'White'}, 
                        Size: {item.productId.name.includes('Boots') ? 9 : 'Medium'}
                    </p>
                </div>
            </div>
            <div className="price">${item.productId.price.toFixed(2)}</div>
            <div className="quantity-control">
                <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="qty-button"
                >
                    <FaMinus style={{ fontSize: '0.6rem' }} />
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="qty-button"
                >
                    <FaPlus style={{ fontSize: '0.6rem' }} />
                </button>
            </div>
            <button onClick={() => handleRemoveItem(item._id)} className="remove-button">
                <FaTrashAlt />
            </button>
        </div>
    );

    return (
        <div className="container shopping-cart">
            <div className="cart-header">
                <h1 className="cart-title">Your Shopping Cart</h1>
                <Link to="/" className="continue-shopping">Continue Shopping</Link>
            </div>
            <p className="reservation-text">
                You have {cart.items.length} items in your cart. Items are not reserved until you checkout.
            </p>

            {loading ? (
                <p>Loading cart...</p>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items-list">
                        {cart.items.length > 0 ? (
                            cart.items.map(item => <CartItemRow key={item._id} item={item} />)
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center' }}>Your cart is empty.</div>
                        )}
                    </div>

                    <div className="summary-card">
                        <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>Order Summary</h3>
                        
                        <div className="summary-row">
                            <p>Subtotal</p>
                            <p>${cart.summary.subtotal || '0.00'}</p>
                        </div>
                        <div className="summary-row">
                            <p>Shipping</p>
                            <p>{cart.summary.shipping > 0 ? `$${cart.summary.shipping}` : 'Free'}</p>
                        </div>
                        <div className="summary-row">
                            <p>Taxes</p>
                            <p>${cart.summary.taxes || '0.00'}</p>
                        </div>
                        
                        <div className="divider"></div>

                        <div className="summary-row" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                            <p>Total</p>
                            <p>${cart.summary.total || '0.00'}</p>
                        </div>

                        <Link 
                            to="/checkout" 
                            className="checkout-button button-base"
                            onClick={(e) => cart.items.length === 0 ? e.preventDefault() : null}
                        >
                            Proceed to Checkout
                        </Link>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
