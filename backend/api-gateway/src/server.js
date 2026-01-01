const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Service URLs (configured via ENV or defaults for local dev)
const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:3002';
const WELLNESS_SERVICE_URL = process.env.WELLNESS_SERVICE_URL || 'http://localhost:3003';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3001';
const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL || 'http://localhost:3004';

console.log('Gateway Configured with:');
console.log('- Identity:', IDENTITY_SERVICE_URL);
console.log('- Wellness:', WELLNESS_SERVICE_URL);
console.log('- AI:', AI_SERVICE_URL);
console.log('- Content:', CONTENT_SERVICE_URL);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'api-gateway' });
});

// --- ROUTES PROXYING ---

// AI Service Routes
app.use('/api/quiz/generate', proxy(AI_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/ai/quiz/generate' + req.url
}));
app.use('/api/pattern-analysis', proxy(AI_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/ai/pattern-analysis' + req.url
}));
app.use('/api/suggestions/generate', proxy(AI_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/ai/suggestions/generate' + req.url
}));
app.use('/api/tara-chat', proxy(AI_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/ai/tara-chat' + req.url
}));
app.use('/api/mood-triggers', proxy(AI_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/ai/mood-triggers' + req.url
}));

// Identity Service Routes
app.use('/api/auth', proxy(IDENTITY_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/auth' + req.url
}));
app.use('/api/user', proxy(IDENTITY_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/user' + req.url
}));
app.use('/api/onboarding', proxy(IDENTITY_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/onboarding' + req.url
}));
app.use('/api/admin/users', proxy(IDENTITY_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/admin/users' + req.url
}));

// Wellness Service Routes
app.use('/api/journal', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/journal' + req.url
}));
app.use('/api/mood-mongo', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/mood' + req.url
}));
app.use('/api/mood', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/mood' + req.url
}));
app.use('/api/goals', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/goals' + req.url
}));
app.use('/api/insights', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/insights/stats' + req.url
}));
app.use('/api/quiz/results', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/quiz/results' + req.url
}));
app.use('/api/stress-check', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/stress-check' + req.url
}));
app.use('/api/emotional-wheel', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/emotional-wheel' + req.url
}));
app.use('/api/reflection-radar', proxy(WELLNESS_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/wellness/reflection-radar' + req.url
}));

// Content Service Routes
app.use('/api/admin/blogs', proxy(CONTENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/admin/blogs' + req.url
}));
app.use('/api/blog', proxy(CONTENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/blog' + req.url
}));
app.use('/api/contact', proxy(CONTENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/contact' + req.url
}));
app.use('/api/imagekit-auth', proxy(CONTENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => '/api/imagekit-auth' + req.url
}));


app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
