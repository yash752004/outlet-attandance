import React, { useState, useEffect } from 'react';
import PunchButton from './PunchButton';
import Timer from './Timer';
import AttendanceTable from './AttendanceTable';
import Toast from '../common/Toast';
import type { AttendanceRecord } from '../../types';
import { calculateTotalHours, getCurrentDate } from '../../utils/dateUtils';

const StaffDashboard: React.FC = () => {
  const [staffName, setStaffName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [currentSession, setCurrentSession] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    // Load staff name from localStorage
    const savedName = localStorage.getItem('staffName');
    if (savedName) {
      setStaffName(savedName);
      setIsNameSet(true);
      loadAttendanceData(savedName);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAttendanceData = async (name: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch from Google Sheets
      // For now, use localStorage as fallback
      const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]') as AttendanceRecord[];
      const staffRecords = records.filter(r => r.staffName === name);
      
      // Sort by date (newest first)
      staffRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setAttendanceHistory(staffRecords);
      
      // Check if there's an active session today
      const today = getCurrentDate();
      const todayRecord = staffRecords.find(r => r.date === today && r.status === 'working');
      if (todayRecord) {
        setCurrentSession(todayRecord);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      showToast('Failed to load attendance history', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffName.trim()) {
      localStorage.setItem('staffName', staffName.trim());
      setIsNameSet(true);
      loadAttendanceData(staffName.trim());
    }
  };

  const handlePunch = async (type: 'in' | 'out', date: string, time: string) => {
    try {
      if (type === 'in') {
        // Create new attendance record
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          staffName,
          date,
          punchIn: time,
          punchOut: '',
          totalHours: 0,
          status: 'working',
        };

        // Save to localStorage (in real app, this would call Google Sheets API)
        const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        records.push(newRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(records));

        setCurrentSession(newRecord);
        setAttendanceHistory([newRecord, ...attendanceHistory]);
        showToast('Punched in successfully!', 'success');

        // In real implementation:
        // await addAttendanceRecord(newRecord);
      } else {
        // Update existing record with punch out
        if (currentSession) {
          const totalHours = calculateTotalHours(currentSession.punchIn, time);
          const updatedRecord: AttendanceRecord = {
            ...currentSession,
            punchOut: time,
            totalHours,
            status: 'completed',
          };

          // Update in localStorage
          const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
          const index = records.findIndex((r: AttendanceRecord) => r.id === currentSession.id);
          if (index !== -1) {
            records[index] = updatedRecord;
            localStorage.setItem('attendanceRecords', JSON.stringify(records));
          }

          setCurrentSession(null);
          setAttendanceHistory([updatedRecord, ...attendanceHistory.filter(r => r.id !== currentSession.id)]);
          showToast('Punched out successfully!', 'success');

          // In real implementation:
          // await updateAttendanceRecord(currentSession.id!, updatedRecord);
        }
      }
    } catch (error) {
      console.error('Punch error:', error);
      showToast('Failed to record punch. Please try again.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    setIsNameSet(false);
    setStaffName('');
    setCurrentSession(null);
    setAttendanceHistory([]);
    localStorage.removeItem('staffName');
  };

  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Staff Dashboard
          </h1>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label htmlFor="staffName" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Name
              </label>
              <input
                type="text"
                id="staffName"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {staffName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Punch Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Time Tracking
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <PunchButton
                type="in"
                staffName={staffName}
                onPunch={handlePunch}
                isPunchedIn={currentSession !== null}
              />
              <PunchButton
                type="out"
                staffName={staffName}
                onPunch={handlePunch}
                isPunchedIn={currentSession !== null}
              />
            </div>
          </div>

          {/* Timer */}
          {currentSession && (
            <Timer
              punchInDate={currentSession.date}
              punchInTime={currentSession.punchIn}
              isActive={true}
            />
          )}

          {/* Attendance History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Attendance History
            </h2>
            <AttendanceTable records={attendanceHistory} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default StaffDashboard;
