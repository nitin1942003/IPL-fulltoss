import { useAuth } from "../hooks/useAuth";
import { Link } from 'react-router-dom';

export const WelcomePage = () => {
    const { auth } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white">
            <main className="flex flex-col items-center p-8 bg-gradient-to-r from-orange-400 to-yellow-200 text-white text-center max-w-2xl">
                <h1 className="text-4xl font-extrabold text-black">
                    Welcome, {auth.user?.firstName}!
                </h1>
                <p className="mt-4 text-lg text-black">
                    You are logged in and ready to explore your favorite products and manage your cart.
                </p>

                <p className="mt-2 text-black">
                    You can review your cart, view your favorite items, and explore more products to add.
                </p>

                <div className="mt-6 space-x-4">
                    <Link to="/profile/cart">
                        <button className="bg-black text-white py-2 px-4 rounded-full font-semibold hover:bg-indigo-800 transition-colors">
                            View Cart
                        </button>
                    </Link>

                    <Link to="/profile/favorites">
                        <button className="bg-black text-white py-2 px-4 rounded-full font-semibold hover:bg-indigo-800 transition-colors">
                            View Favorites
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
};
