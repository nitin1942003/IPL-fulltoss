import { useEffect, useState } from 'react';
import { getCartProducts } from '../services/productService';  // Assuming correct import

export const CartProducts = ({ userId }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const data = await getCartProducts(userId);
        setCartProducts(data);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartProducts();
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : Array.isArray(cartProducts) && cartProducts.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-lg text-gray-500 mt-6">Your cart is empty. Add some products!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-gray-600 font-semibold border-b">Product Name</th>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold border-b">Price</th>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold border-b">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-b">{product.name}</td>
                  <td className="px-6 py-4 border-b">${product.price}</td>
                  <td className="px-6 py-4 border-b">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
