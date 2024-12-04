import dotenv from "dotenv";
import User from "../models/user.js";
import Team from "../models/team.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../models/token.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import mongoose from 'mongoose';

dotenv.config({ path: "../.env" });

// Controller function to get the assigned team for a user
export const getteam = async (req, res) => {
    const { userId } = req.params;

    try {
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID format. Please provide a valid ObjectId.',
                success: false,
            });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found. Please check the user ID.',
                success: false,
            });
        }

        // Check if the user has an assigned team
        if (!user.assignedTeam) {
            return res.status(404).json({
                message: 'No team assigned to this user.',
                success: false,
            });
        }

        // Find the team assigned to the user
        const team = await Team.findById(user.assignedTeam);

        if (!team) {
            return res.status(404).json({
                message: 'Assigned team not found. Please verify the team details.',
                success: false,
            });
        }

        // Send the team details as a response
        return res.status(200).json({ 
            success: true, 
            team 
        });
    } catch (error) {
        console.error('Error fetching team:', error.message);

        // Return a user-friendly error message
        return res.status(500).json({
            message: 'An unexpected error occurred while fetching the team. Please try again later.',
            success: false,
        });
    }
};

// User Registration
export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, assignedTeam } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Validate teamPreference and convert to ObjectId
        let teamId;
        if (assignedTeam) {
            const team = await Team.findOne({ name: assignedTeam });
            if (!team) {
                return res.status(400).json({ message: `Team '${assignedTeam}' does not exist` });
            }
            teamId = team._id;
        } else {
            // Assign default team if no team is provided
            const defaultTeam = await Team.findOne({ name: 'Default Team' });
            if (!defaultTeam) {
                return res.status(400).json({ message: 'No default team available' });
            }
            teamId = defaultTeam._id;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            assignedTeam: teamId || "None", // Default to "None" if no preference is provided
        });

        // Save the user to the database
        await newUser.save();

        // Generate a verification token
        const token = await new Token({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        // Create a verification URL
        const url = `${process.env.CLIENT_URL}/auth/${newUser.id}/verify-email/${token.token}`;

        // HTML content for the verification email
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Welcome to IPL Shop!</h2>
            <p>Hi ${newUser.firstname},</p>
            <p>Thank you for registering. Please click the button below to verify your email:</p>
            <p><a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>If the button doesn't work, click the link below:</p>
            <p><a href="${url}">${url}</a></p>
            <p>If you did not create this account, no further action is required.</p>
            <p>Regards,<br/>IPL Shop Team</p>
        </div>
        `;

        // Send the verification email
        await sendEmail(newUser.email, "Verify Your Email", `Please verify your email by clicking the following link: ${url}`, htmlContent);

        res.status(201).json({ message: "User registered. Please check your email to verify your account." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Email Verification
export const verifyEmail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ message: "Invalid link" });
        }

        const token = await Token.findOne({ userId: user._id, token: req.params.token });
        if (!token) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        await User.findByIdAndUpdate(user._id, { $set: { verified: true } }, { new: true });
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register first.",
                success: false,
            });
        }

        // Check if email is verified
        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();

                const url = `${process.env.CLIENT_URL}/auth/${user._id}/verify-email/${token.token}`;
                await sendEmail(user.email, "Verify Your Email", url);
            }

            return res.status(403).json({
                message: "Your email is not verified. A verification email has been sent.",
                success: false,
            });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password. Please try again.",
                success: false,
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "strict",
        };

        // Send response with token and user info
        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json({
                message: "User logged in successfully.",
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    email: user.email,
                    assignedTeam: user.assignedTeam || "None",
                },
            });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false,
            error: error.message,
        });
    }
};


// User Logout
export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};

// Check Authentication
export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await User.findById(req.user).select("-password");
        res.json({ isAuthenticated: true, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
