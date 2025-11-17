import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // For development without MongoDB, we'll use in-memory storage
    // In production, you can uncomment the MongoDB connection
    console.log('📦 Using in-memory storage (MongoDB not connected)');
    
    // Uncomment below for MongoDB connection
    /*
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mehrangarh-gamify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🗄️ MongoDB Connected: ${conn.connection.host}`);
    */
    
    return { success: true, message: 'In-memory storage active' };
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return { success: false, message: 'Using in-memory storage as fallback' };
  }
};

export default connectDB;