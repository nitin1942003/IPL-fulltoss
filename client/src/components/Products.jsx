import React, { useEffect, useState } from 'react';
import { getAllProductsForTeam } from '../services/productService';
import { useAuth } from '../hooks/useAuth';  // Assuming you have an auth hook to get user data
import { Link } from 'react-router-dom';

const Products = () => {
  const { auth } = useAuth();  // Get the auth data, which should include teamId
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [assignedTeam
    , setTeamId] = useState(null);

  useEffect(() => {
    // Check if the teamId is available in auth, and set it
    if (auth?.user?.assignedTeam
    ) {
      setTeamId(auth.user.assignedTeam
      );  // Assuming teamId is stored in user data
    }
  }, [auth]);

  useEffect(() => {
    // Only fetch products once we have the teamId
    if (assignedTeam
    ) {
      const fetchProducts = async () => {
        try {
          const productList = await getAllProductsForTeam(assignedTeam);
          setProducts(productList);
        } catch (error) {
          setError('Error fetching products.');
        }
      };

      fetchProducts();
    }
  }, [assignedTeam
  ]);

  return (
    <div className="products-container">
      {error && <p className="error">{error}</p>}
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <Link to={`/products/${product.id}`} className="view-details-link">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>No products available for this team.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
