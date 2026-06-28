// server.js
import 'dotenv/config';
import express from 'express';
import { validate } from './middleware/validate.js';
import { applySecurityShield } from './middleware/security.js';
import { registerSchema } from './schemas/auth.js'; // Cleanly imported schema
import { AppError } from './utils/appError.js'; // New Custom Error Class
import { globalErrorHandler } from './middleware/errorHandler.js'; // New Global Safety Net

const app = express();

// 1. Core Body Parsing Middleware
app.use(express.json());

// 2. Security Shield Activation
applySecurityShield(app);

// 3. Operational Environment Configurations
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

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
app.post('/api/auth/register', validate(registerSchema), (req, res) => {
    const { username, email } = req.body;
    res.status(201).json({
        status: 'success',
        message: 'Request payload valid. Proceeding to simulated safe registration.',
        data: { username, email }
    });
});

// CRUCIAL: Global Error Handler MUST be the last middleware in the file
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`[SERVER] Running in ${NODE_ENV} mode on port ${PORT}`);
});