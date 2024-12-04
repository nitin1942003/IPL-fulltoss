import React, { useEffect, useState } from 'react';
import { getProductById, addProductToCart, addProductToFavorites } from '../services/productService';
import { useParams } from 'react-router-dom';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      // Assuming userId is known, pass it accordingly
      const userId = '123'; // Replace with actual userId
      const updatedCart = await addProductToCart(userId, product.id);
      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add product to cart.');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      // Assuming userId is known, pass it accordingly
      const userId = '123'; // Replace with actual userId
      const updatedFavorites = await addProductToFavorites(userId, product.id);
      alert('Product added to favorites!');
    } catch (error) {
      alert('Failed to add product to favorites.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      {error && <p className="error">{error}</p>}
      {product && (
        <div className="product-detail-container">
          <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>

          <div className="product-actions">
            <button onClick={handleAddToCart} className="add-to-cart-btn">Add to Cart</button>
            <button onClick={handleAddToFavorites} className="add-to-favorites-btn">Add to Favorites</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
