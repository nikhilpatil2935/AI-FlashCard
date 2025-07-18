// Environment variables configuration
export default {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-flashcards',
  jwtSecret: process.env.JWT_SECRET || 'development_secret_key',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Cloudinary configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },
  
  // Hugging Face API
  huggingFace: {
    apiToken: process.env.HUGGINGFACE_API_TOKEN || '',
    models: {
      questionGeneration: 'valhalla/t5-base-qg-hl',
      textSummarization: 'facebook/bart-large-cnn',
      multipurpose: 't5-base'
    }
  }
};
