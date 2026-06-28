// middleware/validate.js
import { ZodError } from 'zod';
import { AppError } from '../utils/appError.js'; // Import our new Error class

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const issues = error.errors || error.issues || [];
            const errorMessages = issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
            
            // Pass it cleanly down the pipeline to our global handler as a 400 Bad Request
            return next(new AppError(errorMessages, 400));
        }
        next(error);
    }
};