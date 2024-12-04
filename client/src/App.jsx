import { Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import Unauthorized from './components/Unauthorized'
import Missing from './components/Missing'
import RegistrationForm from "./components/RegistrationForm"
import LoginForm from "./components/LoginForm"
import { WelcomePage } from './components/Welcome'
import {ProfilePage} from './components/Profile'
import EmailVerification from './components/EmailVerification';
import { CartProducts } from './components/CartProducts'; // Your Cart component
import { FavoriteProducts } from './components/FavoriteProducts'; // Your Favorites component
import Products from './components/Products';
import Product from './components/Product';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="auth/:id/verify-email/:token" element={<EmailVerification />} />
        {/* private routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path='profile/cart' element={<CartProducts/>}/>
          <Route path="/profile/favorites" element={<FavoriteProducts/>} />
          <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<Product />} />
        </Route>
        {/* Catch All */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;