const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin/blogs', require('./routes/adminBlogRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/imagekit-auth', require('./routes/imagekitRoutes'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'content-service' });
});

app.listen(PORT, () => {
    console.log(`Content Service running on port ${PORT}`);
});
