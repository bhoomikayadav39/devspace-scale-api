// middleware/validate.js
import { ZodError } from 'zod';

/**
 * Higher-order middleware to validate incoming request data against a Zod schema.
 * @param {ZodSchema} schema - The expected Zod schema for the request body.
 */
export const validate = (schema) => (req, res, next) => {
    try {
        // Parse and validate req.body against the provided schema
        // .parse() throws an error if validation fails
        schema.parse(req.body);
        
        // If validation succeeds, move gracefully to the next step/route handler
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            // Flatten Zod's complex error array into an easy-to-read client payload
            const errorMessages = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return res.status(400).json({
                status: 'fail',
                error: 'Validation Error',
                details: errorMessages,
            });
        }
        
        // If it's a completely unexpected error, pass it down the line
        next(error);
    }
};