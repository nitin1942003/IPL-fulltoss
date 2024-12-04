import express from 'express';
import {
    createProductAndAssignToTeam,
    getAllProductsForTeam,
    getProductById,
    getFavoriteProducts,
    getCartProducts,
    addProductToCart,
    addProductToFavorites,
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'
const router = express.Router();

// Route to create a product and assign it to a team
router.post('/', authMiddleware, createProductAndAssignToTeam)
router.get('/:teamId', getAllProductsForTeam);
router.get('/:productId/view',authMiddleware, getProductById);
router.get('/:userId/favorites',authMiddleware, getFavoriteProducts);
router.get('/:userId/cart',authMiddleware, getCartProducts);

// Add product to cart
router.post('/cart',authMiddleware, addProductToCart);

// Add product to favorites
router.post('/favorites',authMiddleware, addProductToFavorites);

export {router as productRouter};
