# 🚀 Quick Start - Add Shlok Feature

## TL;DR

**Admin Panel is running at:** http://localhost:5173

**To add a new shlok:**
1. Click "Shloks" in sidebar
2. Click "Add Shlok" button
3. Fill required fields (marked with *)
4. Click "Save"
5. Done! ✅

**To export for Flutter app:**
1. Click "Export to JSON" button
2. Two files download
3. Replace files in `Vita/assets/json/`
4. Rebuild Flutter app

---

## Required Fields (Minimum)

```
Chapter #:     [1-18]
Shlok #:       [Any number, e.g., 1, 2.5, 47]
Chapter Name:  [e.g., Arjun Vishaad Yog]
Theme:         [e.g., Strategy, Duty, Knowledge]
Speaker:       [e.g., Krishna, Arjun, Dhritarashtra]
Star Rating:   [1-5]
Summary:       [The meaning/summary of the shlok]
```

## Optional Fields

```
Keywords:     [Space-separated, e.g., War Battle Strategy]
Video Link:   [e.g., 001 1.1.mp4 or YouTube URL]
Sanskrit:     [Devanagari script]
Translation:  [English word-by-word translation]
```

---

## Auto-Hindi Translations

The system **automatically converts** these to Hindi:
- ✅ Chapter names (all 18)
- ✅ Speaker names (Krishna, Arjun, etc.)
- ✅ Themes (Strategy, Duty, Knowledge, etc.)
- ⚠️ Keywords & Summaries (manual for now)

---

## Example: Add Shlok 1.47

```
Chapter #:     1
Chapter Name:  Arjun Vishaad Yog
Shlok #:       47
Theme:         Strategy
Speaker:       Dhritarashtra
Star:          4
Summary:       Never underestimate the opponent and...
Keywords:      War Battle Strategy Observe
```

**Result:**
- Saved to Firestore ✅
- Hindi fields auto-generated ✅
- Available immediately in admin panel ✅
- Export to JSON to use in Flutter app ✅

---

## Validation Rules

| What | Rule |
|------|------|
| Duplicates | ❌ Can't create same Ch.Shlok twice |
| Chapter | ✅ Must be 1-18 |
| Shlok # | ✅ Must be > 0 |
| Star | ✅ Must be 1-5 |
| Required | ✅ All (*) fields must be filled |

---

## Error Messages

**"Shlok already exists"**
→ That chapter.shlok is already in database
→ Edit the existing one instead

**"Please fix validation errors"**
→ Check red highlighted fields
→ Fill all required (*) fields

**"Error saving shlok"**
→ Check internet connection
→ Verify Firestore permissions

---

## Export to JSON Workflow

```
1. Add shloks in admin panel
   ↓
2. Click "Export to JSON"
   ↓
3. Downloads:
   - shlok_data.json
   - shlok_data_hindi.json
   ↓
4. Replace in Vita/assets/json/
   ↓
5. Rebuild Flutter app
   ↓
6. New shloks appear in app!
```

---

## Common Speakers (Auto-Hindi)

| English | Hindi |
|---------|-------|
| Krishna | कृष्ण |
| Arjun | अर्जुन |
| Dhritarashtra | धृतराष्ट्र |
| Sanjay | संजय |
| Duryodhana | दुर्योधन |

## Common Themes (Auto-Hindi)

| English | Hindi |
|---------|-------|
| Strategy | रणनीति |
| Duty | कर्तव्य |
| Knowledge | ज्ञान |
| Action | कर्म |
| Devotion | भक्ति |
| Wisdom | बुद्धि |

## All 18 Chapters (Auto-Hindi)

All chapter names automatically convert to Hindi!

---

## Tips

💡 **Use filters** to find shloks quickly (theme, chapter)

💡 **Click any row** to edit existing shlok

💡 **Export regularly** to backup your data

💡 **Test in app** after adding shloks

💡 **Add keywords** for better searchability

---

## Need Help?

📖 Read full guide: `ADMIN_ADD_SHLOK_GUIDE.md`

📋 Technical details: `IMPLEMENTATION_SUMMARY.md`

🔧 Update translations: `src/utils/hindiConverter.js`

---

**Status:** ✅ Fully Functional  
**Panel:** http://localhost:5173  
**Ready to use!** 🎉
