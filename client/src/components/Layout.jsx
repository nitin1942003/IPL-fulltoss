import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="w-full py-2 bg-gradient-to-r from-black to-orange-600 text-white text-center text-3xl font-bold shadow-lg sticky top-0 z-10">
                <div className="relative flex items-center justify-between px-4">
                    {auth?.user && (
                        <div className="flex items-center space-x-4 font-medium text-lg">
                            <Link to='/profile' className='hover:underline'>
                                Profile
                            </Link>
                            <Link to='/products' className='hover:underline'>
                                Products
                            </Link>
                        </div>
                    )}

                    <div className="text-center flex-1">
                        <Link to="/">
                            IPL - FULL TOSS
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                        {auth?.user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-lg font-medium">Hello, {auth.user.firstName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-white px-2 py-2 font-medium text-lg transition-transform transform hover:scale-105"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-white px-2 py-2 font-medium text-lg transition-transform transform hover:scale-105"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-grow p-6 bg-white shadow-md rounded-lg mx-4 mt-4">
                <Outlet />
            </main>
            <footer className="w-full py-1 bg-gradient-to-r from-black to-orange-600 text-white text-center">
                <p className="text-sm">© 2024 IPL FULL TOSS</p>
            </footer>
        </div>
    );
};

export default Layout;
