import React, { useState, useEffect } from 'react';
import { logoutAdmin } from '../../utils/auth';
import type { AttendanceRecord, StaffConfig } from '../../types';
import { exportToCSV, exportToPDF, exportStaffSalaryReport } from '../../utils/export';
import { getCurrentDate, formatHours } from '../../utils/dateUtils';
import Toast from '../common/Toast';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'staff'>('overview');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [staffConfigs, setStaffConfigs] = useState<StaffConfig[]>([]);
  const [filterStaff, setFilterStaff] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffConfig | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load from localStorage (in real app, fetch from Google Sheets)
    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]') as AttendanceRecord[];
    setAttendanceRecords(records);

    const configs = JSON.parse(localStorage.getItem('staffConfigs') || '[]') as StaffConfig[];
    if (configs.length === 0) {
      // Initialize with default staff
      const defaultConfigs: StaffConfig[] = [
        { name: 'John Doe', baseSalary: 30000, bonus: 2000, monthDays: 26, payable: 32000 },
        { name: 'Jane Smith', baseSalary: 28000, bonus: 1500, monthDays: 26, payable: 29500 },
        { name: 'Bob Johnson', baseSalary: 32000, bonus: 2500, monthDays: 26, payable: 34500 },
      ];
      localStorage.setItem('staffConfigs', JSON.stringify(defaultConfigs));
      setStaffConfigs(defaultConfigs);
    } else {
      setStaffConfigs(configs);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    window.location.reload();
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter(record => {
    if (filterStaff !== 'all' && record.staffName !== filterStaff) return false;
    if (filterDate && record.date !== filterDate) return false;
    if (filterMonth && !record.date.startsWith(filterMonth)) return false;
    return true;
  });

  // Get unique staff names
  const staffNames = Array.from(new Set(attendanceRecords.map(r => r.staffName)));

  // Get today's attendance
  const today = getCurrentDate();
  const todayRecords = attendanceRecords.filter(r => r.date === today);

  // Handle export
  const handleExportCSV = () => {
    exportToCSV(filteredRecords, `attendance-${Date.now()}.csv`);
    showToast('Exported to CSV successfully', 'success');
  };

  const handleExportPDF = () => {
    exportToPDF(filteredRecords, `attendance-${Date.now()}.pdf`);
    showToast('Exported to PDF successfully', 'success');
  };

  const handleExportSalaryReport = () => {
    const month = filterMonth || getCurrentDate().substring(0, 7);
    exportStaffSalaryReport(staffConfigs, attendanceRecords, month, `salary-report-${month}.pdf`);
    showToast('Salary report exported successfully', 'success');
  };

  // Handle delete
  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updated = attendanceRecords.filter(r => r.id !== id);
      localStorage.setItem('attendanceRecords', JSON.stringify(updated));
      setAttendanceRecords(updated);
      showToast('Record deleted successfully', 'success');
    }
  };

  // Handle add/edit record
  const handleSaveRecord = (record: AttendanceRecord) => {
    if (editingRecord) {
      // Update existing
      const updated = attendanceRecords.map(r => r.id === record.id ? record : r);
      localStorage.setItem('attendanceRecords', JSON.stringify(updated));
      setAttendanceRecords(updated);
      showToast('Record updated successfully', 'success');
    } else {
      // Add new
      const newRecord = { ...record, id: Date.now().toString() };
      const updated = [...attendanceRecords, newRecord];
      localStorage.setItem('attendanceRecords', JSON.stringify(updated));
      setAttendanceRecords(updated);
      showToast('Record added successfully', 'success');
    }
    setEditingRecord(null);
    setIsAddingRecord(false);
  };

  // Handle save staff config
  const handleSaveStaffConfig = (config: StaffConfig) => {
    const updated = staffConfigs.map(s => s.name === config.name ? config : s);
    localStorage.setItem('staffConfigs', JSON.stringify(updated));
    setStaffConfigs(updated);
    setEditingStaff(null);
    showToast('Staff configuration updated successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Attendance Management System</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attendance'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attendance Log
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'staff'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Staff Configuration
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Today's Attendance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {staffConfigs.map(staff => {
                const staffRecord = todayRecords.find(r => r.staffName === staff.name);
                const status = staffRecord?.status || 'offline';
                
                return (
                  <div key={staff.name} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{staff.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'working' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        status === 'working' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {status === 'working' ? 'Working' : 'Offline'}
                      </span>
                    </div>
                    {staffRecord && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Punch In: {staffRecord.punchIn}</p>
                        {staffRecord.punchOut && <p>Punch Out: {staffRecord.punchOut}</p>}
                        {staffRecord.totalHours > 0 && (
                          <p>Total Hours: {formatHours(staffRecord.totalHours)}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Staff</p>
                  <p className="text-2xl font-bold text-blue-600">{staffConfigs.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Working Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {todayRecords.filter(r => r.status === 'working').length}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-purple-600">{attendanceRecords.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Log Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Attendance Log</h2>
              <button
                onClick={() => setIsAddingRecord(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add Record
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff</label>
                  <select
                    value={filterStaff}
                    onChange={(e) => setFilterStaff(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Staff</option>
                    {staffNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Punch In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Punch Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.staffName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.punchIn || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.punchOut || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.totalHours > 0 ? formatHours(record.totalHours) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                record.status === 'working'
                                  ? 'bg-green-100 text-green-800'
                                  : record.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setEditingRecord(record)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Staff Configuration Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Staff Configuration</h2>
              <button
                onClick={handleExportSalaryReport}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Export Salary Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffConfigs.map(staff => {
                const monthRecords = attendanceRecords.filter(
                  r => r.staffName === staff.name && r.date.startsWith(getCurrentDate().substring(0, 7))
                );
                const workingDays = monthRecords.length;
                const totalHours = monthRecords.reduce((sum, r) => sum + r.totalHours, 0);

                return (
                  <div key={staff.name} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{staff.name}</h3>
                    
                    {editingStaff?.name === staff.name ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Base Salary
                          </label>
                          <input
                            type="number"
                            value={editingStaff.baseSalary}
                            onChange={(e) => setEditingStaff({
                              ...editingStaff,
                              baseSalary: Number(e.target.value)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bonus
                          </label>
                          <input
                            type="number"
                            value={editingStaff.bonus}
                            onChange={(e) => setEditingStaff({
                              ...editingStaff,
                              bonus: Number(e.target.value)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Month Days
                          </label>
                          <input
                            type="number"
                            value={editingStaff.monthDays}
                            onChange={(e) => setEditingStaff({
                              ...editingStaff,
                              monthDays: Number(e.target.value)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payable
                          </label>
                          <input
                            type="number"
                            value={editingStaff.payable}
                            onChange={(e) => setEditingStaff({
                              ...editingStaff,
                              payable: Number(e.target.value)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveStaffConfig(editingStaff)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStaff(null)}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Salary:</span>
                          <span className="font-semibold">₹{staff.baseSalary}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Bonus:</span>
                          <span className="font-semibold">₹{staff.bonus}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Month Days:</span>
                          <span className="font-semibold">{staff.monthDays}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Payable:</span>
                          <span className="font-semibold text-green-600">₹{staff.payable}</span>
                        </div>
                        <hr className="my-3" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Working Days (This Month):</span>
                          <span className="font-semibold">{workingDays}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Hours:</span>
                          <span className="font-semibold">{formatHours(totalHours)}</span>
                        </div>
                        <button
                          onClick={() => setEditingStaff(staff)}
                          className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          Edit Configuration
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Record Modal */}
      {(isAddingRecord || editingRecord) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingRecord ? 'Edit Record' : 'Add Record'}
            </h3>
            <RecordForm
              record={editingRecord}
              staffNames={staffNames}
              onSave={handleSaveRecord}
              onCancel={() => {
                setEditingRecord(null);
                setIsAddingRecord(false);
              }}
            />
          </div>
        </div>
      )}

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

// Record Form Component
interface RecordFormProps {
  record: AttendanceRecord | null;
  staffNames: string[];
  onSave: (record: AttendanceRecord) => void;
  onCancel: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ record, staffNames, onSave, onCancel }) => {
  const [formData, setFormData] = useState<AttendanceRecord>(
    record || {
      id: '',
      staffName: staffNames[0] || '',
      date: getCurrentDate(),
      punchIn: '09:00:00',
      punchOut: '18:00:00',
      totalHours: 9,
      status: 'completed',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Staff Name</label>
        <select
          value={formData.staffName}
          onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        >
          {staffNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Punch In</label>
        <input
          type="time"
          value={formData.punchIn}
          onChange={(e) => setFormData({ ...formData, punchIn: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Punch Out</label>
        <input
          type="time"
          value={formData.punchOut}
          onChange={(e) => setFormData({ ...formData, punchOut: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
        <input
          type="number"
          step="0.01"
          value={formData.totalHours}
          onChange={(e) => setFormData({ ...formData, totalHours: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'working' | 'offline' | 'completed' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="working">Working</option>
          <option value="completed">Completed</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminDashboard;
