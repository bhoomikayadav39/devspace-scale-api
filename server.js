// server.js
import 'dotenv/config';
import express from 'express';
import { validate } from './middleware/validate.js';
import { applySecurityShield } from './middleware/security.js';
import { registerSchema } from './schemas/auth.js'; // Cleanly imported schema
import { AppError } from './utils/appError.js'; // New Custom Error Class
import { globalErrorHandler } from './middleware/errorHandler.js'; // New Global Safety Net
import { connectDB, closeDB } from './config/db.js';
import { registerUser } from './controllers/authController.js';
import { protect } from './middleware/auth.js';
import { uploadResumeRecord, MyResumes, optimizeResume } from './controllers/resumeController.js';
import { createApplication, getMyApplications, updateApplicationStatus} from './controllers/applicationController.js';

const app = express();

// 1. Core Body Parsing Middleware
app.use(express.json());

// 2. Security Shield Activation
applySecurityShield(app);

// 3. Operational Environment Configurations
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Initialize Database connection before listening to traffic
/*
let db;
try {
    db = await connectDB();
} catch (err) {
    console.error('\n❌ --- DATABASE INITIALIZATION CRASH --- ❌');
    console.error(err); // This will force Node to print the exact error trace
    console.error('-----------------------------------------\n');
}
*/

// Pass db instance down your pipeline via standard Express middleware context
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Base Check Route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'DevSpace Scale API operational.' });
});

// A route to intentionally simulate a nasty server error to test our system
app.get('/api/test-error', (req, res, next) => {
    // Passing an error into next() instantly bypasses normal routes and goes straight to our error pipeline
    return next(new AppError('Simulated Account Access Denied!', 403));
});

// Guarded Route (Notice how incredibly clean this declaration is now)
//  New clean way (Using your imported registerUser controller)
app.post('/api/auth/register', validate(registerSchema), registerUser);
app.post('/api/auth/login', loginUser);
// 🚀 NEW: A completely protected user profile dashboard route
app.get('/api/users/profile', protect, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to your secure profile dashboard!',
        authenticatedUser: req.user // Contains the id and email extracted from the token!
    });
});
// 🚀 NEW: Secured Resume Routing Core
app.post('/api/resumes/upload', protect, uploadResumeRecord);
app.get('/api/resumes/my-resumes', protect, MyResumes);
app.post('/api/resumes/optimize', protect, optimizeResume);
// 🚀 NEW: Secured Job Application Tracker Routes
app.post('/api/applications/create', protect, createApplication);
app.get('/api/applications/my-applications', protect, getMyApplications);
// The :id is a dynamic parameter the controller will read
app.patch('/api/applications/:id/status', protect, updateApplicationStatus);
// CRUCIAL: Global Error Handler MUST be the last middleware in the file
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`[SERVER] Running in ${NODE_ENV} mode on port ${PORT}`);
});

// --- GRACEFUL SHUTDOWN ARCHITECTURE ---
const handleExitSignal = async (signal) => {
    console.log(`\n[SERVER] ${signal} signal received. Starting graceful shutdown sequence...`);
    
    server.close(async () => {
        console.log('[SERVER] Network traffic handling stopped.');
        await closeDB(); // Cleanly disconnect from MongoDB
        process.exit(0);
    });
};

// Listen for Ctrl+C or kill events on Windows/Linux environments
process.on('SIGINT', () => handleExitSignal('SIGINT'));
process.on('SIGTERM', () => handleExitSignal('SIGTERM'));