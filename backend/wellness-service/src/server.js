const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.WELLNESS_SERVICE_PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/wellness', require('./routes/wellness.routes'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'tara-wellness-service' });
});

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Wellness Service running on port ${port}`);
    });
};

startServer();
