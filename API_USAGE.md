# User Management API Documentation

## Overview
Unified chat user management system with conversation storage in MongoDB. All chat users (TARA AI, custom users, celebrities) are stored in a single `chatUsers` array per user.

## Database Structure

### Collection: `users`
```javascript
{
  userId: "firebase_uid",           // Main user's Firebase UID
  email: "user@email.com",
  name: "User Name",
  chatUsers: [                      // Array of ALL chat users
    {
      id: "tara-ai",                // TARA AI (default for everyone)
      name: "TARA AI",
      type: "ai",
      avatar: "/taralogo.jpg",
      conversations: [...]
    },
    {
      id: "unique_id",              // Custom user
      name: "User Name",
      type: "custom",
      avatar: "avatar_url",
      gender: "male/female/other",
      role: "Chill Friend",
      conversations: [               // Chat messages array
        {
          id: "msg_id",
          content: "message text",
          sender: "user/them",
          type: "text/audio",
          timestamp: Date
        }
      ],
      createdAt: Date,
      lastMessageAt: Date
    },
    {
      id: "celebrity-shahrukh",     // Celebrity
      name: "Shahrukh Khan",
      type: "celebrity",
      avatar: "/celebrities/shahrukh.jpeg",
      role: "Celebrity",
      conversations: [...]
    }
  ],
  lastUpdated: Date
}
```

## API Endpoints

### 1. Get All Chat Users
**GET** `/api/users?userId={firebase_uid}`

**Response:**
```json
{
  "success": true,
  "chatUsers": [
    {
      "id": "tara-ai",
      "name": "TARA AI",
      "type": "ai",
      "conversations": [...]
    },
    ...
  ]
}
```

**Note:** Automatically initializes TARA AI if user doesn't exist.

### 2. Add New Chat User (Custom or Celebrity)
**POST** `/api/users`

**Body:**
```json
{
  "userId": "firebase_uid",
  "name": "User Name",
  "avatar": "avatar_url",
  "gender": "male",
  "role": "Chill Friend",
  "type": "custom",           // "custom", "celebrity", or "ai"
  "celebrityId": "celebrity-shahrukh"  // Optional, for celebrities
}
```

**Response:**
```json
{
  "success": true,
  "chatUser": {...},
  "alreadyExists": false      // true if user already exists
}
```

### 3. Delete Chat User
**DELETE** `/api/users?userId={firebase_uid}&chatUserId={chat_user_id}`

**Note:** Cannot delete TARA AI (tara-ai).

### 4. Get Conversations
**GET** `/api/users/conversations?userId={firebase_uid}&chatUserId={chat_user_id}`

**Response:**
```json
{
  "success": true,
  "conversations": [...]
}
```

### 5. Add Message to Conversation
**POST** `/api/users/conversations`

**Body:**
```json
{
  "userId": "firebase_uid",
  "chatUserId": "chat_user_id",
  "message": "message text",
  "sender": "user",
  "type": "text"
}
```

### 6. Clear Conversations
**DELETE** `/api/users/conversations?userId={firebase_uid}&chatUserId={chat_user_id}`

## Chat User Types

### TARA AI (Default)
- ID: `"tara-ai"`
- Type: `"ai"`
- Automatically added to every user's `chatUsers` array
- Available to all users by default
- Uses Groq API for AI responses (separate tara-chat API)
- Cannot be deleted

### Custom Users
- ID format: Generated ObjectId
- Type: `"custom"`
- Created by user through "Add User" modal
- Stored in `chatUsers` array
- Persistent across sessions
- Conversations saved to DB

### Celebrities
- ID format: `"celebrity-{celebrity_id}"`
- Type: `"celebrity"`
- Added when user clicks on celebrity
- Stored in `chatUsers` array (NEW!)
- Persistent across sessions
- Conversations saved to DB

## Frontend Integration

The chatlist page automatically:
1. Loads all chat users (including TARA) on mount
2. Initializes TARA AI if user is new
3. Loads conversations for all chat users
4. Saves messages to DB for all chat users
5. Supports custom users and celebrities in same structure
6. TARA AI uses separate Groq API for responses
