const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/ai', require('./routes/aiRoutes'));
// app.use('/api/chat', require('./routes/chat.routes'));
// app.use('/api/insights', require('./routes/insights.routes'));

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ai-service' });
});

app.listen(PORT, () => {
    console.log(`AI Service running on port ${PORT}`);
});
