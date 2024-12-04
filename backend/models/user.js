import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // Reference to the Team model
    required: true,
  },
  favoriteProducts: {
    type: [Schema.Types.ObjectId], // Array of product IDs the user marked as favorites
    ref: 'Product', // Assuming there's a Product model
    default: [],
  },
  cart: {
    type: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product', // Assuming there's a Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    default: [],
  },
});

const User = mongoose.model('User', userSchema);
export default User;
