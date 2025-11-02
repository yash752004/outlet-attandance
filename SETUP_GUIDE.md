# Google Sheets Setup Guide

This guide will help you set up Google Sheets as a database for the Attendance Management System.

## Prerequisites

- A Google account
- Basic knowledge of Google Sheets and Apps Script

## Step 1: Create Google Sheets

### 1.1 Attendance Sheet

1. Create a new Google Sheet named "Attendance Database"
2. Create the following columns in Sheet1 (rename to "Attendance"):
   - `id` (unique identifier)
   - `staffName` (text)
   - `date` (date format: YYYY-MM-DD)
   - `punchIn` (time format: HH:MM:SS)
   - `punchOut` (time format: HH:MM:SS)
   - `totalHours` (number)
   - `status` (text: working/completed/offline)

### 1.2 Staff Configuration Sheet

1. In the same spreadsheet, create Sheet2 (rename to "StaffConfig"):
   - `name` (text)
   - `baseSalary` (number)
   - `bonus` (number)
   - `monthDays` (number)
   - `payable` (number)

2. Add initial staff data:
   ```
   name          | baseSalary | bonus | monthDays | payable
   John Doe      | 30000      | 2000  | 26        | 32000
   Jane Smith    | 28000      | 1500  | 26        | 29500
   Bob Johnson   | 32000      | 2500  | 26        | 34500
   ```

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete the default code
3. Copy and paste the following code:

```javascript
// Attendance Management System - Google Apps Script API

const ATTENDANCE_SHEET = 'Attendance';
const STAFF_CONFIG_SHEET = 'StaffConfig';

function doGet(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  
  try {
    if (sheet === 'attendance') {
      if (action === 'getAll') {
        return getAttendanceRecords();
      } else if (action === 'getById') {
        return getAttendanceById(e.parameter.id);
      }
    } else if (sheet === 'staff') {
      if (action === 'getAll') {
        return getStaffConfig();
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Invalid action or sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const action = e.parameter.action;
  const sheet = e.parameter.sheet;
  const data = JSON.parse(e.postData.contents);
  
  try {
    if (sheet === 'attendance') {
      if (action === 'add') {
        return addAttendanceRecord(data);
      } else if (action === 'update') {
        return updateAttendanceRecord(e.parameter.id, data);
      } else if (action === 'delete') {
        return deleteAttendanceRecord(e.parameter.id);
      }
    } else if (sheet === 'staff') {
      if (action === 'update') {
        return updateStaffConfig(e.parameter.name, data);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Invalid action or sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Get all attendance records
function getAttendanceRecords() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const record = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = data[i][j];
    }
    records.push(record);
  }
  
  return ContentService.createTextOutput(JSON.stringify(records))
    .setMimeType(ContentService.MimeType.JSON);
}

// Add attendance record
function addAttendanceRecord(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
  const id = Utilities.getUuid();
  
  sheet.appendRow([
    id,
    data.staffName,
    data.date,
    data.punchIn,
    data.punchOut || '',
    data.totalHours || 0,
    data.status || 'working'
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    id: id
  })).setMimeType(ContentService.MimeType.JSON);
}

// Update attendance record
function updateAttendanceRecord(id, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.getRange(i + 1, 2).setValue(data.staffName || values[i][1]);
      sheet.getRange(i + 1, 3).setValue(data.date || values[i][2]);
      sheet.getRange(i + 1, 4).setValue(data.punchIn || values[i][3]);
      sheet.getRange(i + 1, 5).setValue(data.punchOut || values[i][4]);
      sheet.getRange(i + 1, 6).setValue(data.totalHours || values[i][5]);
      sheet.getRange(i + 1, 7).setValue(data.status || values[i][6]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    error: 'Record not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Delete attendance record
function deleteAttendanceRecord(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({
        success: true
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    error: 'Record not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Get staff configuration
function getStaffConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STAFF_CONFIG_SHEET);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const record = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = data[i][j];
    }
    records.push(record);
  }
  
  return ContentService.createTextOutput(JSON.stringify(records))
    .setMimeType(ContentService.MimeType.JSON);
}

// Update staff configuration
function updateStaffConfig(name, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STAFF_CONFIG_SHEET);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === name) {
      sheet.getRange(i + 1, 2).setValue(data.baseSalary || values[i][1]);
      sheet.getRange(i + 1, 3).setValue(data.bonus || values[i][2]);
      sheet.getRange(i + 1, 4).setValue(data.monthDays || values[i][3]);
      sheet.getRange(i + 1, 5).setValue(data.payable || values[i][4]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    error: 'Staff not found'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

## Step 3: Deploy the Apps Script

1. Click on **Deploy > New deployment**
2. Select type: **Web app**
3. Configuration:
   - Description: "Attendance API"
   - Execute as: **Me**
   - Who has access: **Anyone** (or **Anyone with Google account** for more security)
4. Click **Deploy**
5. Copy the **Web app URL** (you'll need this for the frontend)

## Step 4: Update Frontend Configuration

1. Open `src/utils/googleSheets.ts` in your project
2. Update the configuration:

```typescript
export const GOOGLE_SHEETS_CONFIG = {
  ATTENDANCE_ENDPOINT: 'YOUR_WEB_APP_URL?sheet=attendance',
  STAFF_CONFIG_ENDPOINT: 'YOUR_WEB_APP_URL?sheet=staff',
  LOGS_ENDPOINT: 'YOUR_WEB_APP_URL?sheet=logs',
};
```

Replace `YOUR_WEB_APP_URL` with the URL you copied in Step 3.

## Step 5: Test the Integration

### Test GET requests:
```
YOUR_WEB_APP_URL?sheet=attendance&action=getAll
YOUR_WEB_APP_URL?sheet=staff&action=getAll
```

### Test POST requests (using Postman or similar):
```
URL: YOUR_WEB_APP_URL?sheet=attendance&action=add
Method: POST
Body: {
  "staffName": "Test User",
  "date": "2025-11-02",
  "punchIn": "09:00:00",
  "status": "working"
}
```

## Troubleshooting

### Issue: "Authorization required"
- Make sure you've deployed the script with proper permissions
- Re-deploy and authorize the script when prompted

### Issue: "CORS error"
- Apps Script web apps should handle CORS automatically
- If issues persist, add CORS headers in the doGet/doPost functions

### Issue: "Data not updating"
- Check that sheet names match exactly (case-sensitive)
- Verify column headers match the expected format
- Check the Apps Script execution logs (View > Executions)

## Security Considerations

1. **Access Control**: Consider restricting access to "Anyone with Google account"
2. **API Keys**: For production, implement API key authentication
3. **Data Validation**: Add input validation in the Apps Script
4. **Rate Limiting**: Monitor usage and implement rate limiting if needed

## Alternative: n8n Webhook Setup

If you prefer using n8n instead of Google Apps Script:

1. Install n8n (self-hosted or n8n.cloud)
2. Create workflows for:
   - GET /attendance (read from Google Sheets)
   - POST /attendance (write to Google Sheets)
   - PUT /attendance/:id (update in Google Sheets)
   - DELETE /attendance/:id (delete from Google Sheets)
3. Connect n8n to your Google Sheets using the Google Sheets node
4. Get webhook URLs and update `src/utils/googleSheets.ts`

## Next Steps

After setting up Google Sheets integration:
1. Test the Staff Dashboard punch in/out functionality
2. Test the Admin Panel data viewing and editing
3. Test export features (CSV/PDF)
4. Implement proper Wi-Fi verification for production

---

For questions or issues, refer to the main README or open an issue on GitHub.
