const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// The original Next.js api/users route handled GET, POST, DELETE on the same path
// We will map them to sub-routes or keep root if Gateway routes /api/user to here.
// Gateway maps /api/user -> Identity Service /api/user
// So here we are at /api/user base.

// But wait, the original path was /api/users (plural), handled Chat Users.
// There is also likely /api/user (singular) for profile?
// Checking Gateway config: app.use('/api/user', proxy(..., '/api/user'))
// So requests to /api/user/chat-users will come here as /chat-users??
// Wait, Gateway says: proxyReqPathResolver: (req) => '/api/user' + req.url
// If user requests /api/user/chat-users, Gateway forwards to /api/user/chat-users on Service.
// So Service should listen on /api/user/...
// But express app.use('/api/user', userRouter) in server.js.
// So inside userRouter, '/' is '/api/user'.

// BUT, I named the controller methods generic for chat users.
// The original endpoint was /api/users (PLURAL).
// I should probably map /api/users to this controller.
// Let's create `user.routes.js` that handles both User Profile (future) and Chat Users.

// For now, let's replicate the functionality.
// GET /api/user (Profile?) -> Not seen yet.
// GET /api/users (Chat Users) -> This is what we found.

// Since I configured Gateway to route /api/user to Identity Service.
// I should probably expose /api/user/chat-users or similar.
// AND I should also handle /api/user (Profile) which likely exists or is handled by 'me' endpoint?
// I saw 'api/auth/me'.
// Let's just implement the 'chat users' endpoints for now on a specific path.

router.get('/', userController.getChatUsers);
router.get('/chat-users', userController.getChatUsers);
router.post('/chat-users', userController.addChatUser);
router.delete('/chat-users', userController.deleteChatUser);

router.get('/conversations', userController.getConversations);
router.post('/conversations', userController.saveConversation);

module.exports = router;
