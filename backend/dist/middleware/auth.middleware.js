"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Authentication middleware for protected routes
const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');
    // Check if no token
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }
    // Verify token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
exports.authMiddleware = authMiddleware;
