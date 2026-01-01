const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDb } = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.IDENTITY_SERVICE_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// We will add routes here later
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/onboarding', require('./routes/onboarding.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'tara-identity-service' });
});

// Start server
const startServer = async () => {
    await connectToDb();
    app.listen(port, () => {
        console.log(`Identity Service running on port ${port}`);
    });
};

startServer();
