// Google Sheets API Configuration
// Replace these with your actual Google Apps Script endpoint or n8n webhook
export const GOOGLE_SHEETS_CONFIG = {
  ATTENDANCE_ENDPOINT: 'YOUR_GOOGLE_APPS_SCRIPT_URL_OR_N8N_WEBHOOK',
  STAFF_CONFIG_ENDPOINT: 'YOUR_STAFF_CONFIG_URL',
  LOGS_ENDPOINT: 'YOUR_LOGS_URL',
};

interface ApiResponse {
  [key: string]: unknown;
}

// Fetch attendance records
export async function fetchAttendanceRecords(): Promise<ApiResponse[]> {
  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.ATTENDANCE_ENDPOINT);
    if (!response.ok) throw new Error('Failed to fetch attendance records');
    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

// Add attendance record
export async function addAttendanceRecord(data: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.ATTENDANCE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add attendance record');
    return await response.json();
  } catch (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }
}

// Update attendance record
export async function updateAttendanceRecord(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const response = await fetch(`${GOOGLE_SHEETS_CONFIG.ATTENDANCE_ENDPOINT}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update attendance record');
    return await response.json();
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
}

// Delete attendance record
export async function deleteAttendanceRecord(id: string): Promise<void> {
  try {
    const response = await fetch(`${GOOGLE_SHEETS_CONFIG.ATTENDANCE_ENDPOINT}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete attendance record');
  } catch (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
}

// Fetch staff configuration
export async function fetchStaffConfig(): Promise<ApiResponse[]> {
  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.STAFF_CONFIG_ENDPOINT);
    if (!response.ok) throw new Error('Failed to fetch staff config');
    return await response.json();
  } catch (error) {
    console.error('Error fetching staff config:', error);
    throw error;
  }
}

// Update staff configuration
export async function updateStaffConfig(name: string, data: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const response = await fetch(`${GOOGLE_SHEETS_CONFIG.STAFF_CONFIG_ENDPOINT}?name=${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update staff config');
    return await response.json();
  } catch (error) {
    console.error('Error updating staff config:', error);
    throw error;
  }
}
