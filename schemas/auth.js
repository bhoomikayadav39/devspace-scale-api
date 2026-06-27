// schemas/auth.js
import { z } from 'zod';

// Explicitly export the strict registration framework
export const registerSchema = z.object({
    username: z.string({ required_error: 'Username is required' })
               .min(3, 'Username must be at least 3 characters long')
               .max(20, 'Username cannot exceed 20 characters'),
    email: z.string({ required_error: 'Email is required' })
            .email('Invalid email address format'),
    password: z.string({ required_error: 'Password is required' })
               .min(8, 'Password must be at least 8 characters long'),
});