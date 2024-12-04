import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const navigate = useNavigate();

  const handleShowCart = () => {
    navigate('/profile/cart');
  };

  const handleShowFavorites = () => {
    navigate('/profile/favorites');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-black">Profile Page</h1>
      <div className="space-y-4 space-x-10">
        <button 
          onClick={handleShowCart} 
          className="px-4 py-2 bg-black text-white rounded hover:bg-orange-700 transition"
        >
          Show Cart
        </button>
        <button 
          onClick={handleShowFavorites} 
          className="px-4 py-2 bg-black text-white rounded hover:bg-orange-700 transition"
        >
          Show Favorites
        </button>
      </div>
    </div>
  );
};
