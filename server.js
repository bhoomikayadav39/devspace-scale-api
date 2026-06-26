// 1. Import modules using modern ES Modules syntax
import 'dotenv/config'; // Automatically loads env variables at the absolute top
import express from 'express';
import { z } from 'zod'; // Import Zod core library

import { validate } from './middleware/validate.js'; // Import our new middleware

const app = express();

// Crucial: Middleware to tell Express to accept and read incoming JSON bodies
app.use(express.json());

// 2. Safely extract configurations with fallback defaults
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// 1. Define a strict User Registration Schema using Zod
const registerSchema = z.object({
    username: z.string({ required_error: 'Username is required' })
               .min(3, 'Username must be at least 3 characters long')
               .max(20, 'Username cannot exceed 20 characters'),
    email: z.string({ required_error: 'Email is required' })
            .email('Invalid email address format'),
    password: z.string({ required_error: 'Password is required' })
               .min(8, 'Password must be at least 8 characters long'),
});

// Base Route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'DevSpace Scale API' });
});

// 2. Create a POST route guarded completely by our validation engine
app.post('/api/auth/register', validate(registerSchema), (req, res) => {
    // If the execution reaches this block, the data is 100% verified and clean!
    const { username, email } = req.body;

    res.status(201).json({
        status: 'success',
        message: 'Request payload valid. Proceeding to simulated safe registration.',
        data: { username, email }
    });
});

// 4. Start the network listening process
app.listen(PORT, () => {
    console.log(`[SERVER] Running in ${NODE_ENV} mode on port ${PORT}`);
});