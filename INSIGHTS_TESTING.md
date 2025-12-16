# Testing Insights Functionality

The insights page now has proper functionality for Recovery Time and Goals Completed metrics. Here's how to test it:

## What's Fixed

1. **Recovery Time Card** - Now shows meaningful recovery patterns with better calculation
   - Analyzes last 30 days of mood data
   - Tracks transitions from negative moods (sad, anxious, stressed) to positive moods (happy, calm, grateful)
   - Shows resilience level with descriptive messages
   - Fallback estimation based on mood balance when no clear patterns exist

2. **Goals Completed Card** - Shows number of goals completed this month
3. **Emotional Wheel** - Shows better messaging when no data is available
4. **All components** - Now properly fetch user-specific data

## How to Test

### Option 1: Add Sample Data (Recommended)

1. Run the sample data script:
```bash
node scripts/add-sample-data.js
```

2. Update the `sampleUserId` in the script to match your actual user ID
3. The script will add:
   - 30 days of mood data
   - 3 journal entries
   - 2 goals (1 completed, 1 in progress)
   - Sample chat conversations

### Option 2: Create Real Data

1. **For Goals Completed:**
   - Go to `/goals` page
   - Create some goals
   - Mark them as completed
   - Check insights page to see the count

2. **For Recovery Time:**
   - Add mood entries with negative moods (sad, anxious, stressed, lonely, angry, overwhelmed)
   - Add mood entries with positive moods (happy, calm, grateful, motivated) on later dates
   - The system will calculate average days between negative and positive mood transitions
   - Results show:
     - 1-2 days: Excellent resilience ⚡🌟
     - 3-4 days: Good recovery time 💪
     - 5-7 days: Average recovery time 🔄
     - 8+ days: Consider wellness strategies 🌱

3. **For Emotional Wheel:**
   - Write journal entries with emotional content
   - Add mood check-ins
   - The wheel will analyze and show emotion percentages

## API Endpoints

- `/api/insights/stats` - Returns recovery time and goals completed
- `/api/mood-mongo/insights` - Returns mood data and patterns
- `/api/user-data` - Returns user's journals, goals, and moods

## Data Requirements

- **Recovery Time**: 
  - Minimum 3 mood entries in last 30 days
  - Mix of negative moods (sad, anxious, stressed, lonely, angry, overwhelmed, lost)
  - Mix of positive moods (happy, calm, grateful, motivated)
  - System tracks patterns of negative→positive transitions
  
- **Goals Completed**: Needs goals with `completed: true` and `completedAt` date in current month

- **Emotional Wheel**: Needs journal entries and mood data for emotion analysis

## Troubleshooting

1. If cards show "No data yet" or "0":
   - Check if user has sufficient data in MongoDB
   - Verify user authentication is working
   - Check browser console for API errors

2. If components show loading forever:
   - Check API endpoints are responding
   - Verify MongoDB connection
   - Check authentication tokens

The insights page will now show meaningful data based on user's actual journal entries, mood check-ins, and goals progress.