// 1. Import modules using modern ES Modules syntax
import 'dotenv/config'; // Automatically loads env variables at the absolute top
import express from 'express';

const app = express();

// 2. Safely extract configurations with fallback defaults
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// 3. Define a baseline endpoint to verify server responsiveness
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'DevSpace Scale API operational using modern ES Modules.',
        environment: NODE_ENV
    });
});

// 4. Start the network listening process
app.listen(PORT, () => {
    console.log(`[SERVER] Running in ${NODE_ENV} mode on port ${PORT}`);
});