# Life Areas Quiz & Radar Chart Feature

## Overview
Complete quiz system for life areas with minimum/maximum selection validation, pre-built quizzes for 8 default topics, AI-generated quizzes for custom topics, and radar chart visualization.

## Features Implemented

### 1. Onboarding Validation
**File: `app/onboarding/page.js`**

- **Minimum Selection**: Users must select at least 4 life areas
- **Maximum Selection**: Users can select maximum 8 life areas
- **Counter Display**: Shows "X/8 selected" to guide users
- **Validation**: Step 4 only proceeds when 4-8 areas are selected

### 2. Quiz Data System
**File: `lib/quizData.js`**

Pre-built quizzes for 8 default life areas:
1. **Financial Growth** - 5 questions about financial planning, savings, emergency fund
2. **Family** - 5 questions about family relationships and communication
3. **Health** - 5 questions about physical health, exercise, sleep, diet
4. **Personal Growth** - 5 questions about learning and self-development
5. **Love & Relationships** - 5 questions about romantic relationships
6. **Career** - 5 questions about job satisfaction and work-life balance
7. **Social Life** - 5 questions about friendships and social connections
8. **Spirituality** - 5 questions about spiritual connection and mindfulness

Each quiz has:
- 5 questions
- 5 options per question (scored 5, 4, 3, 2, 1)
- Score calculation: (total/max) * 100 = percentage

### 3. AI Quiz Generation
**File: `app/api/quiz/generate/route.js`**

- Generates quizzes for custom life areas added by users
- Uses Groq AI (llama-3.3-70b-versatile model)
- Returns same format as default quizzes (5 questions, 5 options each)
- Handles JSON parsing from AI response

### 4. Quiz Results Storage
**File: `app/api/quiz/results/route.js`**

- **GET**: Retrieves user's quiz results and life areas
- **POST**: Saves quiz results with score, answers, and timestamp
- Stores in MongoDB user document under `quizResults` field

**Database Schema Update:**
```javascript
quizResults: {
  "Financial Growth": {
    score: 85,
    answers: [5, 4, 5, 4, 5],
    completedAt: Date,
    updatedAt: Date
  },
  "Custom Area": {
    score: 70,
    answers: [4, 3, 4, 3, 4],
    completedAt: Date,
    updatedAt: Date
  }
}
```

### 5. Quiz Component
**File: `app/components/LifeAreaQuiz.js`**

- Modal-based quiz interface
- Progress bar showing current question
- 5 options per question
- Back button to review previous questions
- Auto-saves results on completion
- Loading states for quiz generation and submission

### 6. Radar Chart Component
**File: `app/components/RadarChart.js`**

Features:
- **SVG-based radar chart** with dynamic number of axes (based on selected life areas)
- **Grid circles** at 20%, 40%, 60%, 80%, 100% levels
- **Filled area** showing overall life balance
- **Data points** for each life area
- **Labels** positioned around the chart
- **Life areas list** below chart with:
  - ✓ Green checkmark for completed quizzes
  - 🔒 Lock icon for pending quizzes
  - Score display for completed areas
  - "Check Now" button (becomes "Retake" after completion)

### 7. Insights Page Integration
**File: `app/insights/page.js`**

- Replaced "Support Reflection Radar" (disabled) with "Life Areas Assessment" (active)
- Shows radar chart with quiz results
- Users can take/retake quizzes directly from insights page

### 8. User Model Update
**File: `lib/models/User.js`**

Added:
- `quizResults` field to store quiz data
- `findByUid()` method to find users by Firebase UID or Google ID

## User Flow

1. **Onboarding**:
   - User selects 4-8 life areas (enforced validation)
   - Can add custom areas using "Add Other" button

2. **Insights Page**:
   - Navigate to Insights → Life Areas Assessment card
   - See radar chart (empty if no quizzes taken)
   - Click "Check Now" on any life area

3. **Taking Quiz**:
   - Modal opens with quiz questions
   - Answer 5 questions (can go back)
   - Results auto-save on completion

4. **View Results**:
   - Radar chart updates with new score
   - Score displayed as percentage (0-100%)
   - Can retake quiz anytime to update score

## API Endpoints

### Generate Quiz (AI)
```
POST /api/quiz/generate
Body: { lifeArea: "Custom Area Name" }
Response: { quiz: [...] }
```

### Save Quiz Results
```
POST /api/quiz/results
Body: { lifeArea: "Area Name", answers: [5,4,3,4,5], score: 84 }
Response: { message: "Success", quizResults: {...} }
```

### Get Quiz Results
```
GET /api/quiz/results
Response: { quizResults: {...}, lifeAreas: [...] }
```

## Technical Details

### Quiz Scoring
- Each question: 1-5 points
- Total possible: 25 points (5 questions × 5 max)
- Percentage: (actual/25) × 100

### Radar Chart Math
- Center: (200, 200)
- Max radius: 150px
- Angle per area: 360° / number of areas
- Point position: center + (score% × radius) × (cos/sin of angle)

### AI Quiz Generation
- Model: llama-3.3-70b-versatile (Groq)
- Temperature: 0.7
- Max tokens: 2000
- Fallback: Parses JSON from markdown code blocks if needed

## Environment Variables Required
```
GROQ_API_KEY=your_groq_api_key
```

## Files Created/Modified

### Created:
- `lib/quizData.js` - Quiz data for 8 default topics
- `app/api/quiz/generate/route.js` - AI quiz generation
- `app/api/quiz/results/route.js` - Quiz results API
- `app/components/LifeAreaQuiz.js` - Quiz modal component
- `app/components/RadarChart.js` - Radar chart visualization

### Modified:
- `app/onboarding/page.js` - Added min/max validation (4-8 areas)
- `app/insights/page.js` - Integrated radar chart
- `lib/models/User.js` - Added quizResults field and findByUid method

## Future Enhancements
- Quiz history tracking
- Trend analysis over time
- Recommendations based on low scores
- Share results feature
- Export as PDF
