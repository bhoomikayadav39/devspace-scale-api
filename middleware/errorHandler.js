// middleware/errorHandler.js

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // 1. DEVELOPMENT LOGGING (Show everything so we can fix bugs)
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack // Show where the code broke
        });
    }

    // 2. PRODUCTION LOGGING (Keep secrets hidden from clients/hackers)
    if (process.env.NODE_ENV === 'production') {
        // If it's a known error we created on purpose
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }

        // If it's a weird system bug, don't leak details to the hacker
        console.error('[CRITICAL BUG]:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Something went incredibly wrong on our end.'
        });
    }
};