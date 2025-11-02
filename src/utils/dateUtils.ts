import { format, differenceInMinutes } from 'date-fns';

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// Format time to HH:mm:ss
export function formatTime(date: Date): string {
  return format(date, 'HH:mm:ss');
}

// Format date and time to display format
export function formatDateTime(date: Date): string {
  return format(date, 'MMM dd, yyyy HH:mm:ss');
}

// Calculate total hours between two time strings
export function calculateTotalHours(punchIn: string, punchOut: string): number {
  try {
    const inDate = new Date(`1970-01-01T${punchIn}`);
    const outDate = new Date(`1970-01-01T${punchOut}`);
    const minutes = differenceInMinutes(outDate, inDate);
    return Number((minutes / 60).toFixed(2));
  } catch (error) {
    console.error('Error calculating total hours:', error);
    return 0;
  }
}

// Format duration in minutes to readable format (e.g., "2h 30m")
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// Get current date string
export function getCurrentDate(): string {
  return formatDate(new Date());
}

// Get current time string
export function getCurrentTime(): string {
  return formatTime(new Date());
}

// Parse date and time to Date object
export function parseDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

// Calculate working duration from punch in time to now
export function calculateWorkingDuration(punchInDate: string, punchInTime: string): number {
  const punchIn = parseDateTime(punchInDate, punchInTime);
  const now = new Date();
  return differenceInMinutes(now, punchIn);
}

// Format hours to readable string
export function formatHours(hours: number): string {
  return `${hours.toFixed(2)} hrs`;
}
