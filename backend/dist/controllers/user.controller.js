"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const validation_1 = require("../utils/validation");
// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validate input
        const validationError = (0, validation_1.validateRegistration)(name, email, password);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const user = new user_model_1.default({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        const validationError = (0, validation_1.validateLogin)(email, password);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        // Check if user exists
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};
exports.login = login;
// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error while fetching profile' });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        // Update user
        const updatedUser = await user_model_1.default.findByIdAndUpdate(req.userId, { name, email }, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error while updating profile' });
    }
};
exports.updateProfile = updateProfile;
