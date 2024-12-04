import Team from '../models/team.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';

// Create a product and assign it to a team
export const createProductAndAssignToTeam = async (req, res) => {
    try {
        const { teamId, name, description, price, productImageUrl } = req.body;

        // Create a new product with productImageUrl
        const newProduct = await Product.create({ name, description, price, productImageUrl });

        // Find the team and assign the product
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.products.push(newProduct._id);
        await team.save();

        res.status(201).json({ message: 'Product created and assigned', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all products for a specific team
export const getAllProductsForTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId).populate('products');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json({ products: team.products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get details of a single product by its ID
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get favorite products for a user
export const getFavoriteProducts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and populate favorite products
        const user = await User.findById(userId).populate({
            path: 'favoriteProducts',
            select: 'name description price productImageUrl'
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ favoriteProducts: user.favoriteProducts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get cart products for a user
export const getCartProducts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and populate cart products
        const user = await User.findById(userId).populate({
            path: 'cart.productId',
            select: 'name description price productImageUrl'
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartProducts = user.cart.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            description: item.productId.description,
            price: item.productId.price,
            productImageUrl: item.productId.productImageUrl,
            quantity: item.quantity
        }));

        res.status(200).json({ cartProducts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add a product to the user's cart
export const addProductToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productQuantity = quantity || 1;
        const existingProductIndex = user.cart.findIndex((item) => item.productId.toString() === productId);

        if (existingProductIndex >= 0) {
            user.cart[existingProductIndex].quantity += productQuantity;
        } else {
            user.cart.push({ productId, quantity: productQuantity });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add a product to the user's favorites
export const addProductToFavorites = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.favoriteProducts.includes(productId)) {
            user.favoriteProducts.push(productId);
            await user.save();
        }

        res.status(200).json({ message: 'Product added to favorites', favoriteProducts: user.favoriteProducts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};