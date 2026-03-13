# Admin "Add Shlok" Feature - User Guide

## Overview

The Admin panel's "Add Shlok" feature is now fully functional and allows you to create new shloks that are immediately available in Firestore with automatic Hindi translation.

## Features

✅ **Complete Form Fields**
- Chapter number (1-18)
- Chapter name
- Shlok number
- Keywords (space-separated)
- Star rating (1-5)
- Theme
- Speaker
- Shlok summary/meaning
- Video/AV link
- Sanskrit/Devanagari text
- English translation

✅ **Automatic Hindi Conversion**
- Chapter names → Hindi
- Themes → Hindi
- Speaker names → Hindi
- Keywords → Hindi (when translations available)
- Summaries → Hindi (when translations available)

✅ **Data Validation**
- Prevents duplicate chapter + shlok combinations
- Validates required fields
- Ensures star rating is 1-5
- Shows clear error messages

✅ **Success/Error Feedback**
- Toast notifications for all actions
- Clear validation errors inline
- Confirmation dialogs for deletion

✅ **Export to JSON**
- Export all shloks to `shlok_data.json` (English)
- Export all shloks to `shlok_data_hindi.json` (Hindi with __8_hi)
- Downloads both files with one click
- Maintains exact structure as existing JSON files

## How to Use

### Adding a New Shlok

1. **Navigate to Shloks Page**
   - From the Admin panel sidebar, click "Shloks"

2. **Click "Add Shlok" Button**
   - Located in the top-right corner

3. **Fill Required Fields** (marked with *)
   - **Chapter #**: Enter 1-18
   - **Shlok #**: Enter the shlok number (can be decimal like 2.5)
   - **Chapter Name**: e.g., "Arjun Vishaad Yog"
   - **Theme**: e.g., "Strategy", "Duty", "Knowledge"
   - **Speaker**: e.g., "Krishna", "Arjun", "Dhritarashtra"
   - **Star Rating**: 1-5 stars
   - **Summary**: The meaning or summary of the shlok

4. **Fill Optional Fields**
   - **Keywords**: Space-separated keywords
   - **Video Link**: e.g., "001 1.1.mp4" or YouTube URL
   - **Sanskrit Text**: Devanagari script version
   - **English Translation**: Word-by-word translation

5. **Click "Save"**
   - The system will automatically:
     - Validate all fields
     - Check for duplicates
     - Generate Hindi translations
     - Save to Firestore
     - Show success message

### Editing an Existing Shlok

1. **Click on any row** in the shloks table
2. The edit modal will open with pre-filled data
3. Make your changes
4. Click "Save"
5. Duplicate validation applies (excluding the current shlok)

### Deleting a Shlok

1. Click on a shlok row to open edit modal
2. Click "Delete" button (red, at bottom left)
3. Confirm deletion in the dialog
4. Shlok is permanently removed from Firestore

### Filtering Shloks

Use the filter bars to:
- Filter by Theme (multiple selection)
- Filter by Chapter (multiple selection)
- Combine filters for precise searches

### Exporting to JSON

1. **Click "Export to JSON"** button (top-right, next to "Add Shlok")
2. Two files will download automatically:
   - `shlok_data.json` (English structure)
   - `shlok_data_hindi.json` (Hindi structure with __8_hi)
3. These files can be used to update the Flutter app's assets

## Data Structure

### Firestore Structure
```javascript
{
  chapter: 1,                    // Integer
  number: 1.0,                   // Float
  title: "Arjun Vishaad Yog",  // Chapter name
  summary: "Summary text...",
  speaker: "Dhritarashtra",
  theme: "Strategy",
  star: 5,                       // 1-5
  keywords: ["Dharma", "War"],   // Array
  sanskrit: "Sanskrit text...",
  translation: "English trans...",
  posterImageUrl: "",
  videoLink: "001 1.1.mp4",
  
  // Hindi fields
  title_hi: "अर्जुन विषाद योग",
  summary_hi: "सारांश...",
  speaker_hi: "धृतराष्ट्र",
  theme_hi: "रणनीति",
  keywords_hi: ["धर्म", "युद्ध"], // Array
  
  // Metadata
  createdAt: "2024-...",
  updatedAt: "2024-..."
}
```

### JSON Export Structure
```json
{
  "": "",
  "__1": 1,                           // Chapter #
  "__2": "Arjun Vishaad Yog",        // Chapter Name
  "__3": 1,                           // Shlok #
  "__4": "Keywords Here",             // Keywords (space-separated)
  "__5": 5,                           // Star rating
  "__6": "Strategy",                  // Theme
  "__7": "Dhritarashtra",            // Speaker
  "__8": "Summary text...",           // Summary
  "__9": "001 1.1.mp4",              // AV Link
  "__2_hi": "अर्जुन विषाद योग",      // Hindi chapter name
  "__7_hi": "धृतराष्ट्र",            // Hindi speaker
  "__6_hi": "रणनीति",                 // Hindi theme
  "__4_hi": "हिंदी keywords",         // Hindi keywords
  "__8_hi": "सारांश..."               // Hindi summary (only in shlok_data_hindi.json)
}
```

## Hindi Translation Logic

### Automatic Translations

The system automatically translates common terms:

**Speakers:**
- Krishna → कृष्ण
- Arjun/Arjuna → अर्जुन
- Dhritarashtra → धृतराष्ट्र
- Sanjay/Sanjaya → संजय
- Duryodhana → दुर्योधन

**Themes:**
- Strategy → रणनीति
- Duty → कर्तव्य
- Knowledge → ज्ञान
- Action → कर्म
- Devotion → भक्ति
- Wisdom → बुद्धि

**Chapter Names:**
- Arjun Vishaad Yog → अर्जुन विषाद योग
- Sankhya Yog → सांख्य योग
- Karma Yog → कर्म योग
- (All 18 chapters included)

### Manual Hindi Input

For fields not automatically translated:
1. You can manually add Hindi translations
2. Use a translation service for summaries
3. Update `hindiConverter.js` to add more automatic translations

## Integration with Flutter App

### Current Setup
- Flutter app reads from JSON files (`shlok_data.json` and `shlok_data_hindi.json`)
- JSON files are bundled with the app in `assets/json/`

### To Update Flutter App with New Shloks

1. **Add Shlok via Admin Panel**
   - Use the Add Shlok form as described above
   - Shlok is saved to Firestore

2. **Export to JSON**
   - Click "Export to JSON" button
   - Two files download: `shlok_data.json` and `shlok_data_hindi.json`

3. **Update Flutter App**
   - Replace `Vita/assets/json/shlok_data.json` with the new file
   - Replace `Vita/assets/json/shlok_data_hindi.json` with the new file
   - Rebuild the Flutter app
   - New shloks will be available in the app

### Future Enhancement: Direct Firestore Integration

To make shloks available immediately without JSON export:

1. Update `lib/services/shlok_service.dart` to read from Firestore instead of JSON
2. Add caching logic for offline support
3. Keep JSON as fallback/initial data

This would eliminate the need for manual JSON updates.

## Validation Rules

| Field | Rule |
|-------|------|
| Chapter | Required, 1-18 |
| Shlok Number | Required, > 0 |
| Chapter Name | Required, non-empty |
| Theme | Required, non-empty |
| Speaker | Required, non-empty |
| Summary | Required, non-empty |
| Star | Required, 1-5 |
| Keywords | Optional |
| Video Link | Optional |
| Sanskrit | Optional |
| Translation | Optional |

**Duplicate Check:**
- Combination of (Chapter, Shlok Number) must be unique
- Error shown if duplicate exists

## Troubleshooting

### "Shlok already exists" Error
- Check if the chapter + shlok number combination is already in the database
- Use filters to find the existing shlok
- Edit the existing shlok instead of creating a duplicate

### Hindi Text Shows English
- Check `src/utils/hindiConverter.js` for translations
- Add missing translations to the dictionaries
- Or manually enter Hindi text in the form

### Export Button Not Working
- Check browser console for errors
- Ensure Firestore connection is active
- Verify you have shloks in the database

### Shlok Not Appearing in Flutter App
- Remember: Flutter reads from JSON files, not Firestore
- Export to JSON after adding shloks
- Replace JSON files in Flutter app's assets
- Rebuild Flutter app

## Technical Details

### Files Modified/Created

**New Files:**
- `src/utils/hindiConverter.js` - Hindi translation utilities
- `src/utils/exportShloks.js` - JSON export functionality
- `Admin__panel/ADMIN_ADD_SHLOK_GUIDE.md` - This documentation

**Modified Files:**
- `src/pages/Shloks.jsx` - Complete form with all fields
- `src/services/shlokService.js` - Add/update with Hindi conversion

### Dependencies
- Firebase Firestore (already installed)
- No new npm packages required

## Support

For issues or enhancements:
1. Check Firestore console for data
2. Review browser console for errors
3. Verify Firebase rules allow read/write to shloks collection
4. Ensure admin authentication is working

---

**Last Updated:** February 8, 2026
**Version:** 1.0
