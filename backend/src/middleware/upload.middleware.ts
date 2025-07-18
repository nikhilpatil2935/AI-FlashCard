import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists for development
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define storage options
const storage = process.env.NODE_ENV === 'production'
  // Use Cloudinary for production
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        public_id: (req: any, file: any) => `ai-flashcards/${Date.now()}-${file.originalname}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        resource_type: 'auto'
      } as any
    })
  // Use local storage for development
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

// Configure file filter
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images and PDFs only!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

export default upload;
