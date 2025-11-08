import React from 'react';
import './ProductCard.css'; 

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product._id);
  };

  return (
    <div className="product-card">
      <div className="image-wrapper">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-image"
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      <h3 className="title">{product.name}</h3>
      <div className="price">${product.price.toFixed(2)}</div>
      <button className="add-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
