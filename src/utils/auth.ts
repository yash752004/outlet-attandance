// Admin authentication using localStorage
const ADMIN_CREDENTIALS = {
  username: 'ultradenimoutlet',
  password: 'ultradenimoutlet',
};

const AUTH_KEY = 'outlet_attendance_admin_auth';

// Check if admin is logged in
export function isAdminLoggedIn(): boolean {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  
  try {
    const authData = JSON.parse(auth);
    return authData.isAuthenticated === true;
  } catch {
    return false;
  }
}

// Login admin
export function loginAdmin(username: string, password: string): boolean {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const authData = {
      isAuthenticated: true,
      username,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return true;
  }
  return false;
}

// Logout admin
export function logoutAdmin(): void {
  localStorage.removeItem(AUTH_KEY);
}

// Get admin data
export function getAdminData(): { username: string; loginTime: string } | null {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return null;
  
  try {
    const authData = JSON.parse(auth);
    return {
      username: authData.username,
      loginTime: authData.loginTime,
    };
  } catch {
    return null;
  }
}
