// controllers/authController.js
import jwt from 'jsonwebtoken';

// 🚀 Keep it completely empty, just like a fresh, blank database table!
const mockUserDatabase = [];

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const userExists = mockUserDatabase.some(user => user.email === email);
        if (userExists) {
            return res.status(400).json({
                status: 'fail',
                message: 'Registration rejected. Email is already registered.'
            });
        }

        // We temporarily store the password dynamically so the login function can verify it
        const newUser = {
            id: `mock_id_${Math.random().toString(36).substr(2, 9)}`,
            username,
            email,
            password, // Stored dynamically in memory for our login check
            createdAt: new Date().toISOString()
        };
        
        mockUserDatabase.push(newUser);
        console.log(`[MOCK DB] New User Saved Dynamically:`, username);

        // Send response (Notice we still don't send the password back to the client!)
        res.status(201).json({
            status: 'success',
            message: 'User account created successfully.',
            data: { 
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    createdAt: newUser.createdAt
                } 
            }
        });

    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Scans the array for whatever user was just registered!
        const user = mockUserDatabase.find(u => u.email === email);

        if (!user || user.password !== password) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Authentication successful.',
            token,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });

    } catch (error) {
        next(error);
    }
};