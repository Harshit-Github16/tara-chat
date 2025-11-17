# Emotional Wheel Feature Implementation

## Overview
Added a complete Emotional Wheel feature that allows users to track their life areas and emotional intensity.

## Implementation Details

### 1. Onboarding Enhancement (Step 4)
**File: `app/onboarding/page.js`**
- Added new Step 4: "Life Areas That Matter"
- 8 predefined life areas:
  1. Financial Growth
  2. Family
  3. Health
  4. Personal Growth
  5. Love & Relationships
  6. Career
  7. Social Life
  8. Spirituality
- "Add Other" option for custom life areas
- Updated progress bar from 3 to 4 steps
- Validation: At least one life area must be selected

### 2. Database Schema Update
**Files: `lib/models/User.js`, `app/api/onboarding/route.js`**
- Added `lifeAreas` field to User model
- Added `emotionalWheelData` field to store intensity ratings
- Added `lastEmotionalWheelUpdate` timestamp

### 3. Emotional Wheel API
**File: `app/api/emotional-wheel/route.js`**
- **GET**: Fetch user's life areas and saved emotional wheel data
- **POST**: Save emotional wheel intensity data

### 4. Emotional Wheel Component
**File: `app/components/EmotionalWheel.js`**
- Modal-based interface
- Displays user's selected life areas from onboarding
- Intensity slider (0-5) for each life area
- Color-coded visualization:
  - 0: Gray (No intensity)
  - 1: Light Amber
  - 2: Light Orange
  - 3: Medium Orange
  - 4: Dark Orange
  - 5: Deep Orange
- Bar chart visualization showing relative intensities
- Save functionality to persist data

### 5. Insights Page Integration
**File: `app/insights/page.js`**
- Replaced disabled Emotional Wheel chart with active component
- "Check Your Emotional Wheel" button in Emotional Wheel card
- Clicking opens modal with intensity sliders

## User Flow

1. **Onboarding (New Users)**
   - Complete Steps 1-3 (Basic Info, Profession, Interests)
   - Step 4: Select life areas that matter for mental health
   - Can add custom areas using "Add Other" button

2. **Insights Page**
   - Navigate to Insights tab
   - Find "Emotional Wheel" card
   - Click "Check Your Emotional Wheel" button

3. **Emotional Wheel Modal**
   - See all selected life areas
   - Adjust intensity sliders (0-5) for each area
   - View bar chart visualization
   - Click "Save Changes" to persist data
   - Data is saved to user profile

## Features

### Visual Elements
- Gradient color scheme based on intensity
- Smooth slider interactions
- Bar chart visualization
- Responsive design (mobile & desktop)
- Loading states
- Error handling

### Data Persistence
- Life areas saved during onboarding
- Intensity ratings saved separately
- Can be updated anytime from Insights page
- Timestamp tracking for last update

## Technical Stack
- Next.js 14 (App Router)
- MongoDB for data storage
- JWT authentication
- FontAwesome icons
- Tailwind CSS for styling

## Future Enhancements
- Historical tracking of intensity changes over time
- Trend analysis and insights
- Recommendations based on low-intensity areas
- Integration with mood data for correlations
- Circular wheel visualization (like the reference image)
