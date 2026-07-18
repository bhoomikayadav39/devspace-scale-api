// middleware/auth.js
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if the token exists in the HTTP Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Extract the token string out of the "Bearer <TOKEN>" format
            token = req.headers.authorization.split(' ')[1];
        }

        // 2. If no token is found, block access instantly
        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Access denied. You are not logged in. Please provide a valid token.'
            });
        }

        // 3. Verify the token using your private JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        // 4. Attach the decoded user data payload directly to the request object
        // This passes the user's ID and email down the line to any controller that runs next!
        req.user = decoded;
        
        next(); // Let them pass through the gate!

    } catch (error) {
        // If the token is expired, fake, or corrupted, jwt.verify throws an error
        return res.status(401).json({
            status: 'fail',
            message: 'Access denied. Your token is invalid or has expired.'
        });
    }
};