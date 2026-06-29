// config/db.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
let dbInstance = null;

export const connectDB = async () => {
    try {
        if (dbInstance) return dbInstance; // Return existing connection if already connected

        console.log('[DATABASE] Connecting to MongoDB...');
        await client.connect();
        
        // Ping the deployment to ensure it's structurally active
        await client.db('admin').command({ ping: 1 });
        
        dbInstance = client.db(); // Captures the default database from the URI string
        console.log('[DATABASE] MongoDB connection established successfully.');
        
        return dbInstance;
    } catch (error) {
        console.error('[DATABASE CRITICAL ERROR]:', error.message);
        process.exit(1); // Crash the app safely if the database isn't reachable on startup
    }
};

// Graceful shutdown helper
export const closeDB = async () => {
    if (client) {
        await client.close();
        console.log('[DATABASE] MongoDB connection safely terminated.');
    }
};