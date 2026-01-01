# Database Migration Scripts

## Migrate Moods to User Objects

This script migrates mood data from the separate `moods` collection to the `users` collection, storing moods as an array within each user document.

### Why?
- Simplifies database structure
- Reduces number of collections
- Improves query performance for user-specific data
- Makes data management easier

### Before Running

1. **Backup your database** (important!)
2. Make sure you have the MongoDB URI in your `.env.local` file

### How to Run

```bash
# From project root
node scripts/migrate-moods-to-users.js
```

### What it does

1. Reads all documents from the `moods` collection
2. For each mood document:
   - Finds the corresponding user
   - Formats mood entries properly
   - Adds them to the user's `moods` array
3. Reports success/failure statistics

### After Migration

1. Verify the migration was successful by checking a few users in MongoDB
2. Test the mood tracking features in your app
3. Once confirmed working, you can delete the old `moods` collection:

```javascript
// In MongoDB shell or Compass
db.moods.drop()
```

### New Data Structure

**Before (separate collection):**
```javascript
// moods collection
{
  _id: "userId_2025-11-07",
  userId: ObjectId("..."),
  date: "2025-11-07",
  entries: [
    { mood: "happy", intensity: 8, note: "Great day!", timestamp: ... }
  ]
}
```

**After (in user object):**
```javascript
// users collection
{
  _id: ObjectId("..."),
  firebaseUid: "...",
  name: "User Name",
  moods: [
    {
      id: "...",
      mood: "happy",
      intensity: 8,
      note: "Great day!",
      date: "2025-11-07",
      timestamp: ...,
      createdAt: ...
    }
  ]
}
```

### Rollback

If something goes wrong:
1. Restore from your backup
2. The old `moods` collection data is not deleted by this script
3. You can re-run the migration after fixing any issues
