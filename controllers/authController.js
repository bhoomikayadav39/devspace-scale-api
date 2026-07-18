// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // 🚀 Import bcrypt

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

        // 1. Generate a salt and hash the password before saving (10 salt rounds is standard)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Save the user with the HASHED password
        const newUser = {
            id: `mock_id_${Math.random().toString(36).substr(2, 9)}`,
            username,
            email,
            password: hashedPassword, // 🔒 Securely encrypted!
            createdAt: new Date().toISOString()
        };
        
        mockUserDatabase.push(newUser);
        
        // Log the hash to your terminal so you can see what it looks like!
        console.log(`[MOCK DB] User registered. Saved Password Hash:`, hashedPassword);

        res.status(201).json({
            status: 'success',
            message: 'User account created successfully.',
            data: { 
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
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

        const user = mockUserDatabase.find(u => u.email === email);

        // 1. Security Check: If user exists, use bcrypt to compare plain-text login password with the stored hash
        if (!user || !(await bcrypt.compare(password, user.password))) {
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