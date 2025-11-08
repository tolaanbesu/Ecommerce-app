import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import * as api from '../api';
import { MdFilterList } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import '../../styles/productListing.css'; 

const categories = ['All', 'New Arrivals', 'Most Popular', 'On Sale', 'Furniture', 'Decor'];
 
const PRODUCTS_PER_PAGE = 12; 

const ProductListing = ({ onAddToCart, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');

    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('All');
    }
    setCurrentPage(1); // reset page when category changes
  }, [location.search]);

  const handleAddToCart = async (productId) => {
    try {
      await api.addToCart(productId, 1);
      alert('Item added to cart!');
      onAddToCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart.');
    }
  };

  // Filter products based on category & search query
  const filteredProducts = products.filter((p) => {
  const matchesCategory =
    selectedCategory === 'All' ||
    p.category.toLowerCase() === selectedCategory.toLowerCase();

  const matchesSearch = searchQuery
    ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
    : true;

  return matchesCategory && matchesSearch;
});

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  return (
    <div className="container product-listing">
      <h1>Our Products</h1>
      <p className="subheading">
        Discover our hand-picked collection of curated items just for you.
      </p>

      <div className="filter-bar">
        <div className="category-group">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-button ${cat === selectedCategory ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="search-bar">
          <MdFilterList
            style={{ fontSize: '1.2rem', color: 'var(--primary-text)' }}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : paginatedProducts.length > 0 ? (
        <div className="product-grid">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <p className="no-results">No products found matching your search.</p>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i + 1}
              className={`page ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
