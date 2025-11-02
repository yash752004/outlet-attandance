# Wi-Fi Authenticated Attendance Management System

A modern, web-based attendance management system built with React, TypeScript, and TailwindCSS. This application enables staff to punch in/out with Wi-Fi verification and provides administrators with comprehensive attendance tracking and salary management capabilities.

## 🚀 Features

### Staff Dashboard
- **Manual Punch In/Out**: Staff can manually record their attendance
- **Wi-Fi Verification**: Punch buttons are enabled only when connected to the office Wi-Fi (UltraDenim_Office)
- **Live Timer**: Real-time tracking of working hours since punch-in
- **Attendance History**: View previous attendance records
- **Toast Notifications**: Visual feedback for all actions

### Admin Panel
- **Secure Login**: Static admin credentials (username: ultradenimoutlet, password: ultradenimoutlet)
- **Dashboard Overview**: 
  - Real-time view of all staff and today's attendance
  - Status indicators (working/offline)
  - Quick statistics
- **Attendance Management**:
  - Full attendance log with filtering (by staff, date, month)
  - Manual add/edit/delete entries
  - Export to CSV or PDF
- **Staff Configuration**:
  - Manage salary, bonus, and working days for each staff member
  - Automatic payable salary calculation based on attendance
  - Export salary reports
- **Data Export**: Generate CSV and PDF reports

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS v4
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **PDF Generation**: jsPDF with jspdf-autotable
- **Data Storage**: Google Sheets (via API) + LocalStorage (for development)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yash752004/outlet-attandance.git
   cd outlet-attandance
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🔧 Configuration

### Google Sheets Integration

To connect to Google Sheets as your database:

1. **Create a Google Sheet** with the following tabs:
   - **Attendance**: Columns: `id`, `staffName`, `date`, `punchIn`, `punchOut`, `totalHours`, `status`
   - **Staff Config**: Columns: `name`, `baseSalary`, `bonus`, `monthDays`, `payable`

2. **Set up Google Apps Script**:
   - Create a new Apps Script project
   - Deploy as a web app
   - Copy the deployment URL

3. **Update the configuration** in `src/utils/googleSheets.ts`:
   ```typescript
   export const GOOGLE_SHEETS_CONFIG = {
     ATTENDANCE_ENDPOINT: 'YOUR_GOOGLE_APPS_SCRIPT_URL',
     STAFF_CONFIG_ENDPOINT: 'YOUR_STAFF_CONFIG_URL',
     LOGS_ENDPOINT: 'YOUR_LOGS_URL',
   };
   ```

### Alternative: n8n Webhook

You can also use n8n webhooks:
1. Set up n8n workflows for CRUD operations
2. Update the endpoints in `src/utils/googleSheets.ts`

### Wi-Fi Verification

The app includes Wi-Fi verification logic in `src/utils/wifiCheck.ts`. Current implementation:
- Uses browser's online/offline detection
- For production, implement proper verification via:
  - IP range checking
  - Network-specific API endpoint
  - Geolocation with network info

## 📁 Project Structure

```
outlet-attandance/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx    # Admin panel with all features
│   │   │   └── Login.tsx             # Admin login component
│   │   ├── staff/
│   │   │   ├── AttendanceTable.tsx   # Attendance history table
│   │   │   ├── PunchButton.tsx       # Punch in/out buttons
│   │   │   ├── StaffDashboard.tsx    # Staff main view
│   │   │   └── Timer.tsx             # Live working duration timer
│   │   └── common/
│   │       ├── ErrorMessage.tsx      # Error display component
│   │       ├── Loading.tsx           # Loading indicator
│   │       └── Toast.tsx             # Toast notifications
│   ├── utils/
│   │   ├── auth.ts                   # Admin authentication
│   │   ├── dateUtils.ts              # Date/time utilities
│   │   ├── export.ts                 # CSV/PDF export functions
│   │   ├── googleSheets.ts           # Google Sheets API integration
│   │   └── wifiCheck.ts              # Wi-Fi verification logic
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── App.tsx                       # Main app with routing
│   ├── main.tsx                      # App entry point
│   └── index.css                     # Global styles (Tailwind)
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 Usage

### For Staff

1. Navigate to the Staff Dashboard
2. Enter your name
3. Ensure you're connected to the office Wi-Fi
4. Click "Punch In" to start your workday
5. Click "Punch Out" when leaving
6. View your attendance history in the table below

### For Admins

1. Navigate to the Admin Panel
2. Login with credentials:
   - Username: `ultradenimoutlet`
   - Password: `ultradenimoutlet`
3. **Overview Tab**: View today's attendance and quick stats
4. **Attendance Log Tab**: 
   - Filter records by staff, date, or month
   - Add, edit, or delete attendance records
   - Export data to CSV or PDF
5. **Staff Configuration Tab**:
   - Edit staff salary and bonus settings
   - View working days and total hours
   - Export salary reports

## 🔐 Security Notes

- Admin credentials are stored in `src/utils/auth.ts`
- Change default credentials before production deployment
- For production, implement proper authentication (JWT, OAuth, etc.)
- Use environment variables for sensitive configuration
- Implement HTTPS for all connections

## 📊 Data Storage

Currently uses **LocalStorage** for development. For production:
- Implement Google Sheets API integration
- Or use n8n webhooks
- Or integrate with any REST API backend

Data is structured as:
- **Attendance Records**: `localStorage.getItem('attendanceRecords')`
- **Staff Configuration**: `localStorage.getItem('staffConfigs')`
- **Admin Session**: `localStorage.getItem('outlet_attendance_admin_auth')`

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled
- Requires LocalStorage enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues & Limitations

1. **Wi-Fi Verification**: Browser APIs don't provide SSID information. Current implementation uses online/offline detection. For production, implement server-side verification.

2. **Data Persistence**: Currently uses LocalStorage. Implement proper backend for production use.

3. **Authentication**: Static credentials for demo purposes. Implement proper auth system for production.

## 🚧 Future Enhancements

- [ ] Implement proper backend API
- [ ] Add biometric authentication
- [ ] Mobile app versions (React Native)
- [ ] Multi-language support
- [ ] Email notifications for attendance
- [ ] Advanced reporting and analytics
- [ ] Shift management
- [ ] Leave management system
- [ ] Integration with payroll systems

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for UltraDenim Outlet**
