import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from './models/team.js'; // Adjust the path to your Team model
import Product from './models/product.js'; // Adjust the path to your Product model

dotenv.config(); // Load environment variables from .env

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// IPL Teams Data
const teams = [
    { name: 'Chennai Super Kings', description: 'CSK Team led by MS Dhoni', logo: 'https://drive.google.com/uc?export=view&id=1IYUbYWTcqlyaUSek5Y8RZSjPxQLCh2Eb', tshirtImage: 'https://drive.google.com/uc?export=view&id=11SjEnUO7j6NOid4KPYX-16eE1wejAwWd' },
    { name: 'Mumbai Indians', description: 'MI Team led by Rohit Sharma', logo: 'https://drive.google.com/uc?export=view&id=1Ut_8RFrXukJ4b5z5gamZbh0p5aPnnR6A', tshirtImage: 'https://drive.google.com/uc?export=view&id=1x6jgf9crPvFqNvV7sHDBAYhiE2CxdrPr' },
    { name: 'Royal Challengers Bangalore', description: 'RCB Team led by Virat Kohli', logo: 'https://drive.google.com/uc?export=view&id=1n5LhlHh0lQVuzdlG2dJ_9TO8Eflwqir6', tshirtImage: 'https://drive.google.com/uc?export=view&id=1knlspyuY9cIseMQHQp1wOXsaB4w_AMp9' },
    { name: 'Kolkata Knight Riders', description: 'KKR Team led by Nitish Rana', logo: 'https://drive.google.com/uc?export=view&id=17aTZf0yW7Ie5cK5X9V8VCA0xlD-X22aY', tshirtImage: 'https://drive.google.com/uc?export=view&id=1s8kpP4TYGjJvoSvaAW-TGp6OcxwlRZKI' },
    { name: 'Delhi Capitals', description: 'DC Team led by David Warner', logo: 'https://drive.google.com/uc?export=view&id=1_kc6sXHsCmygTyij40lUc75YKy7F-WEB', tshirtImage: 'https://drive.google.com/uc?export=view&id=1PzbsE4XOLSQlwlHHvbMtq9egmmKP2l1B' },
    { name: 'Sunrisers Hyderabad', description: 'SRH Team led by Aiden Markram', logo: 'https://drive.google.com/uc?export=view&id=1ewDluYISTTkgpcNN-SIkqhABUKi52577', tshirtImage: 'https://drive.google.com/uc?export=view&id=1mIaep_RQxA7g2yUlSE5PB1pWs7Sj-Q-A' },
    { name: 'Punjab Kings', description: 'PBKS Team led by Shikhar Dhawan', logo: 'https://drive.google.com/uc?export=view&id=10HamurnYZBtqFITBKvXjjVMHAmFZX3l3', tshirtImage: 'https://drive.google.com/uc?export=view&id=1XKifmuvvvVCPsJGejvLSh3W7Qk3D_mLh' },
    { name: 'Rajasthan Royals', description: 'RR Team led by Sanju Samson', logo: 'https://drive.google.com/uc?export=view&id=1M25iw-SpWiqoMunLwc3786MPm3bIA8IK', tshirtImage: 'https://drive.google.com/uc?export=view&id=1Xcs8r3OE5_3FZ9wgFQ-XAvEX3JSucv7L' },
    { name: 'Lucknow Super Giants', description: 'LSG Team led by KL Rahul', logo: 'https://drive.google.com/uc?export=view&id=1Xx_zO6GeogLJeYK2xr-y5b-VZE1Wa_v5', tshirtImage: 'https://drive.google.com/uc?export=view&id=1lk1qeJLIwWs1362MdheFb5-aTPBsdS0u' },
    { name: 'Gujarat Titans', description: 'GT Team led by Hardik Pandya', logo: 'https://drive.google.com/uc?export=view&id=17Wfc-OSyDyShjFCFK9yo_bWeVDzJbZPl', tshirtImage: 'https://drive.google.com/uc?export=view&id=1EwOvbkFbOJuFsWwEV1iHLiwSYl-CWMYf' },
];

// Seed IPL Teams and T-shirts
const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany();
        await Team.deleteMany();
        console.log('Cleared existing teams and products');

        for (const teamData of teams) {
            
            // Create a T-shirt product for the team
            const product = await Product.create({
                name: `${teamData.name} T-shirt`,
                description: `Official T-shirt for ${teamData.name}`,
                price: 599, // Example price
                image: teamData.tshirtImage,
            });
            // Create a team
            const team = await Team.create({
                name: teamData.name,
                description: teamData.description,
                logo: teamData.logo,
                products: [product._id], // Add product ID to products array
            });

            console.log(`Created team: ${team.name} and product: ${product.name}`);
        }

        console.log('Successfully seeded teams and products');
        process.exit(0); // Exit process with success
    } catch (error) {
        console.error('Error seeding teams and products:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Run the seed function
seedData();