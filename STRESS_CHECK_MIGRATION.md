# Stress Check Migration Summary

## Overview
Successfully rebranded DASS-21 assessment to "Stress Level Check" to avoid copyright issues.

## Key Changes

### 1. URL Changes
- **Old URL**: `/dass21`
- **New URL**: `/stress-check`
- Added permanent redirect in `next.config.mjs`

### 2. Terminology Changes
- "DASS-21 Assessment" → "Stress Level Check"
- "Depression" → "Low Mood"
- Question options simplified:
  - "Did not apply to me at all" → "Not at all"
  - "Applied to me to some degree" → "Sometimes"
  - "Applied to me to a considerable degree" → "Often"
  - "Applied to me very much" → "Most of the time"

### 3. Files Created/Modified

#### New Files
- `app/stress-check/page.js` - Main assessment page
- `app/stress-check/layout.js` - SEO metadata
- `app/api/stress-check/route.js` - New API endpoint

#### Modified Files
- `app/components/DASS21Results.js` - Updated to use lowmood instead of depression
- `app/components/DASS21Suggestions.js` - Updated terminology and source field
- `app/components/DASS21Suggestion.js` - Updated description text
- `app/insights/page.js` - Updated links and titles
- `app/journal/page.js` - Updated navigation link
- `app/goals/page.js` - Updated navigation link
- `app/chatlist/page.js` - Updated navigation link
- `app/api/pattern-analysis/route.js` - Updated to check stressCheckAssessments
- `app/api/goals/route.js` - Added support for stress-check source
- `next.config.mjs` - Added redirect from old URL

### 4. Database Field Changes
- New field: `stressCheckAssessments` (replaces `dass21Assessments`)
- Score fields: `lowmood`, `anxiety`, `stress` (changed from `depression`)
- Old data remains for backward compatibility

### 5. Backward Compatibility
- Old `/dass21` URL redirects to `/stress-check`
- Old API endpoint `/api/dass21` still exists for legacy support
- Goals API accepts both "dass21" and "stress-check" as source values

## Testing Checklist
- [ ] Visit `/stress-check` and complete assessment
- [ ] Verify `/dass21` redirects to `/stress-check`
- [ ] Check all navigation links work correctly
- [ ] Verify results display with "Low Mood" instead of "Depression"
- [ ] Test goal creation from stress check suggestions
- [ ] Verify insights page shows stress check results
- [ ] Check that simplified question options display correctly

## Notes
- All user-facing text has been updated
- Internal code may still reference "dass21" for backward compatibility
- Database migration not required - new assessments use new field names
