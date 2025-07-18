"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure uploads directory exists for development
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Define storage options
const storage = process.env.NODE_ENV === 'production'
    // Use Cloudinary for production
    ? new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_config_1.default,
        params: {
            public_id: (req, file) => `ai-flashcards/${Date.now()}-${file.originalname}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
            resource_type: 'auto'
        }
    })
    // Use local storage for development
    : multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
        }
    });
// Configure file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Error: Images and PDFs only!'));
    }
};
// Configure multer
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: fileFilter
});
exports.default = upload;
