// controllers/authController.js

// Mock database array simulating our MongoDB User collection for now
const mockUserDatabase = [];

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // 1. Simulate an 'Email Already Exists' check
        const userExists = mockUserDatabase.some(user => user.email === email);
        if (userExists) {
            return res.status(400).json({
                status: 'fail',
                message: 'Registration rejected. Email is already registered in our system.'
            });
        }

        // 2. Simulate saving the user structure (We don't return the password back!)
        const newUser = {
            id: `mock_id_${Math.random().toString(36).substr(2, 9)}`,
            username,
            email,
            createdAt: new Date().toISOString()
        };
        
        mockUserDatabase.push(newUser);
        console.log(`[MOCK DB] User successfully registered:`, newUser);

        // 3. Send back the clean architectural standard response
        res.status(201).json({
            status: 'success',
            message: 'User account created successfully (Simulated Environment).',
            data: { user: newUser }
        });

    } catch (error) {
        next(error); // Sends any unhandled runtime crashes directly to your globalErrorHandler
    }
};