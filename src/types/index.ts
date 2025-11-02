export interface AttendanceRecord {
  id?: string;
  staffName: string;
  date: string;
  punchIn: string;
  punchOut: string;
  totalHours: number;
  status: 'working' | 'offline' | 'completed';
}

export interface StaffConfig {
  name: string;
  baseSalary: number;
  bonus: number;
  monthDays: number;
  payable: number;
}

export interface LogEntry {
  action: string;
  performedBy: string;
  timestamp: string;
}

export interface PunchData {
  staffName: string;
  timestamp: string;
  type: 'in' | 'out';
}
