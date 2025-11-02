import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AttendanceRecord, StaffConfig } from '../types';
import { formatDateTime } from './dateUtils';

// Export attendance records to CSV
export function exportToCSV(records: AttendanceRecord[], filename: string = 'attendance.csv'): void {
  const headers = ['Staff Name', 'Date', 'Punch In', 'Punch Out', 'Total Hours', 'Status'];
  const rows = records.map(record => [
    record.staffName,
    record.date,
    record.punchIn,
    record.punchOut,
    record.totalHours.toString(),
    record.status,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export attendance records to PDF
export function exportToPDF(records: AttendanceRecord[], filename: string = 'attendance.pdf'): void {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Attendance Report', 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${formatDateTime(new Date())}`, 14, 22);
  
  // Add table
  autoTable(doc, {
    startY: 30,
    head: [['Staff Name', 'Date', 'Punch In', 'Punch Out', 'Total Hours', 'Status']],
    body: records.map(record => [
      record.staffName,
      record.date,
      record.punchIn,
      record.punchOut,
      record.totalHours.toFixed(2),
      record.status,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
  });
  
  doc.save(filename);
}

// Export staff salary report to PDF
export function exportStaffSalaryReport(
  staffConfigs: StaffConfig[],
  attendanceRecords: AttendanceRecord[],
  month: string,
  filename: string = 'salary-report.pdf'
): void {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Staff Salary Report', 14, 15);
  
  // Add month
  doc.setFontSize(10);
  doc.text(`Month: ${month}`, 14, 22);
  doc.text(`Generated on: ${formatDateTime(new Date())}`, 14, 28);
  
  // Calculate working days for each staff
  const staffData = staffConfigs.map(config => {
    const staffRecords = attendanceRecords.filter(
      r => r.staffName === config.name && r.date.startsWith(month)
    );
    const workingDays = staffRecords.length;
    const totalHours = staffRecords.reduce((sum, r) => sum + r.totalHours, 0);
    
    return [
      config.name,
      config.baseSalary.toFixed(2),
      config.bonus.toFixed(2),
      workingDays.toString(),
      totalHours.toFixed(2),
      config.payable.toFixed(2),
    ];
  });
  
  // Add table
  autoTable(doc, {
    startY: 35,
    head: [['Staff Name', 'Base Salary', 'Bonus', 'Working Days', 'Total Hours', 'Payable']],
    body: staffData,
    theme: 'grid',
    headStyles: { fillColor: [76, 175, 80] },
  });
  
  doc.save(filename);
}
