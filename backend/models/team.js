import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    logo: {
        type: String, // URL or file path of the team logo
        required: true, // Ensure every team has a logo
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
