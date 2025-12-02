# C/C++ Challenge - Data Persistence Guide

## How Your Progress is Saved

Your progress in the C/C++ Challenge is now automatically saved using multiple methods:

### 1. **Automatic Local Storage** (Primary Method)
- ✅ Progress is **automatically saved** every time you check/uncheck a task
- ✅ Data persists across page reloads on the **same device and browser**
- ✅ No manual action required
- 📍 Stored in your browser's localStorage

### 2. **Export/Import Feature** (Cross-Device Sync)
Use this to transfer your progress between devices:

#### To Export Your Progress:
1. Click the **"💾 Export Progress"** button
2. A JSON file will be downloaded to your computer
3. The filename includes the date: `cpp_challenge_progress_YYYY-MM-DD.json`

#### To Import Progress on Another Device:
1. Open the same page on another device
2. Click the **"📥 Import Progress"** button
3. Select the exported JSON file
4. Your progress will be restored instantly!

### 3. **Progress Tracking Features**

#### Visual Indicators:
- **Progress Bar**: Shows overall completion percentage
- **Stats Cards**: Display days completed, tasks done, and current streak
- **Day Status**: Each day shows Pending/In-Progress/Completed
- **Last Saved**: Shows when your progress was last auto-saved

#### Quick Actions:
- 🔄 **Reset Progress**: Clear all progress (with confirmation)
- 💾 **Export Progress**: Download progress as JSON file
- 📥 **Import Progress**: Load progress from JSON file
- 🖨️ **Print Schedule**: Print the challenge schedule

## Tips for Multi-Device Usage

1. **Daily Workflow**:
   - Work on tasks throughout the day
   - Progress saves automatically in your browser
   
2. **Switching Devices**:
   - Export from Device A → Import to Device B
   - Continue working on Device B
   - Export from Device B → Import back to Device A

3. **Backup Strategy**:
   - Export your progress weekly
   - Keep backup files in cloud storage (Google Drive, Dropbox, etc.)
   - This protects against browser data clearing

## Technical Details

### Data Structure:
```json
{
  "tasks": [
    {"day": 1, "task": 1},
    {"day": 1, "task": 2}
  ],
  "lastUpdate": "2025-12-02T10:30:00.000Z",
  "version": "1.0"
}
```

### Browser Compatibility:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ All modern browsers with localStorage support

### Data Location:
- Stored in browser localStorage under key: `cpp_challenge_progress`
- Persists until you clear browser data
- Independent per browser/device

## Troubleshooting

**Q: I reloaded the page and lost my progress**
- A: Check if you're in incognito/private mode (localStorage doesn't persist there)
- A: Check if your browser settings clear data on exit

**Q: Import button doesn't work**
- A: Make sure you're selecting a valid JSON file exported from this app
- A: Check the file hasn't been corrupted or manually edited

**Q: Last saved time not updating**
- A: Refresh the page, it updates every minute automatically

**Q: Can I share my progress file?**
- A: Yes! Export and share the JSON file with others or use it as a template

## Privacy & Security

- ✅ All data is stored **locally** in your browser
- ✅ No data is sent to any server
- ✅ Export files are stored on **your device only**
- ✅ Complete control over your data

---

**Need Help?** Check the main [README.md](README.md) for more information.
