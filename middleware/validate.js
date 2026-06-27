// middleware/validate.js
import { ZodError } from 'zod';

/**
 * Higher-order middleware to validate incoming request data against a Zod schema.
 */
export const validate = (schema) => (req, res, next) => {
    try {
        // Parse and validate req.body against the provided schema
        schema.parse(req.body);
        
        // If validation succeeds, move to the next route handler
        next();
    } catch (error) {
        // Check if the error is a true Zod Validation Error
        if (error instanceof ZodError) {
            // Zod stores errors inside either error.errors or error.issues depending on version
            const issues = error.errors || error.issues || [];
            
            const errorMessages = issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return res.status(400).json({
                status: 'fail',
                error: 'Validation Error',
                details: errorMessages,
            });
        }
        
        // If it's an unexpected system error, pass it along
        next(error);
    }
};