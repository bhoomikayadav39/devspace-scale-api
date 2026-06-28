// utils/appError.js

/**
 * Custom operational error class to standardize API errors.
 */
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        // Determine status based on HTTP code (4xx = fail, 5xx = error)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Operational errors are predictable errors we expect (e.g., wrong input, user already exists)
        this.isOperational = true;

        // Capture the stack trace so we can debug easily in development
        Error.captureStackTrace(this, this.constructor);
    }
}