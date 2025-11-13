# Mood Check-In System Flow

## Overview
The mood check-in system allows users to track their daily emotional state with 10 different mood options and intensity levels.

## Mood Options (Updated)
1. 😊 Happy (intensity: 10)
2. 😢 Sad (intensity: 2)
3. 😠 Angry (intensity: 1)
4. 😰 Stressed (intensity: 3) - **Changed from Anxious**
5. 😴 Tired (intensity: 5)
6. 😌 Calm (intensity: 7)
7. 🤗 Excited (intensity: 9)
8. 😔 Disappointed (intensity: 4)
9. 😤 Frustrated (intensity: 3)
10. 🥰 Loved (intensity: 8)

## Default Selection
- **Happy (😊)** is selected by default when the mood check-in component loads

## API Flow

### 1. Mood Check-In Component (`app/components/MoodCheckIn.js`)
- User selects a mood from 10 options
- User adjusts intensity slider (1-10)
- Optional: User can add a note
- On submit: POST request to `/api/mood-mongo`

### 2. Mood API (`app/api/mood-mongo/route.js`)
**POST /api/mood-mongo**
- Validates user authentication via JWT token
- Validates mood value against allowed moods
- Creates mood entry with:
  - `id`: Unique ObjectId
  - `mood`: Lowercase mood value (e.g., 'happy', 'stressed')
  - `intensity`: 1-10 scale
  - `note`: Optional user note
  - `date`: YYYY-MM-DD format
  - `timestamp`: Full datetime
  - `createdAt`: Full datetime
- Stores in MongoDB `users` collection under `moods` array
- Returns success response with entry data

**GET /api/mood-mongo**
- Query params:
  - `date`: Optional specific date (YYYY-MM-DD)
  - `limit`: Number of recent entries (default: 30)
- Returns mood entries for the user

### 3. Insights Page (`app/insights/page.js`)
**Mood Meter Chart**
- Fetches last 30 mood entries via GET `/api/mood-mongo?limit=30`
- Maps mood values to fixed intensity scores
- Displays last 7 days as bar chart
- Calculates average mood for the week

**Check-In Calendar**
- Shows last 7 days with check-in status
- Calculates current streak
- Displays streak count with fire emoji 🔥

**Streak Calculation**
- Counts consecutive days with mood entries
- Resets if user misses a day
- Displayed in "Check-in Streak" stat card

## Data Storage (MongoDB)

### User Document Structure
```javascript
{
  _id: ObjectId,
  firebaseUid: "string",
  email: "string",
  name: "string",
  moods: [
    {
      id: "string",
      mood: "happy",
      intensity: 7,
      note: "Feeling great today!",
      date: "2025-01-15",
      timestamp: ISODate,
      createdAt: ISODate
    },
    // ... more mood entries
  ]
}
```

## Welcome Page Flow
1. User lands on `/welcome` page
2. Confetti animation plays (3 seconds)
3. MoodCheckIn component shows with Happy pre-selected
4. User can adjust mood and intensity
5. On "Save Mood":
   - API saves to MongoDB
   - Success message shows
   - Component hides
   - Quick Actions section appears

## Key Features
✅ 10 mood options with emojis
✅ Intensity slider (1-10)
✅ Default Happy mood selected
✅ MongoDB storage
✅ Insights visualization
✅ Streak tracking
✅ Last 7 days calendar view
✅ Average mood calculation

## API Endpoints Summary
- `POST /api/mood-mongo` - Save new mood entry
- `GET /api/mood-mongo?limit=30` - Get recent moods
- `GET /api/mood-mongo?date=YYYY-MM-DD` - Get moods for specific date
