# Frontend - Task Management Mobile App

React Native Expo app with Expo Router for file-based routing and role-based navigation.

## 🚀 Quick Start

```bash
npm install
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Press `w` for web version
- Scan QR code with Expo Go app on phone

## 📝 Configuration

Update API endpoint in `constants/api.ts`:

```typescript
// For Android Emulator (localhost as 10.0.2.2)
export const API_BASE = "http://10.0.2.2:5500/api";

// For Physical Device (use actual IP)
export const API_BASE = "http://192.168.x.x:5500/api";

// For Web
export const API_BASE = "http://localhost:5500/api";
```

## 🗂️ Project Structure

```
frontend/
├── app/
│   ├── _layout.tsx                 # Root layout with auth guard
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx               # Login screen
│   ├── (admin)/
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx           # Admin overview
│   │   ├── create-user.tsx         # Create employee
│   │   ├── create-task.tsx         # Create task
│   │   ├── users.tsx               # All users list
│   │   └── tasks.tsx               # All tasks list
│   ├── (hrd)/
│   │   ├── _layout.tsx
│   │   └── dashboard.tsx           # HR overview
│   ├── (manager)/
│   │   ├── _layout.tsx
│   │   └── dashboard.tsx           # Manager dashboard
│   ├── (supervisor)/
│   │   ├── _layout.tsx
│   │   └── dashboard.tsx           # Supervisor dashboard
│   └── (worker)/
│       ├── _layout.tsx
│       └── dashboard.tsx           # Worker tasks
├── context/
│   └── AuthContext.tsx             # Global auth state
├── constants/
│   ├── api.ts                      # API endpoints
│   ├── Colors.ts                   # Theme colors
│   └── Config.ts                   # App config
├── styles/
│   ├── admin/
│   ├── hrd/
│   ├── manager/
│   ├── supervisor/
│   ├── worker/
│   └── auth/
└── components/
    ├── EditScreenInfo.tsx
    ├── ExternalLink.tsx
    ├── StyledText.tsx
    ├── Themed.tsx
    └── useClientOnlyValue.ts
```

## 🔐 Authentication

### Login Flow
1. User enters Employee Number + Password
2. POST `/api/auth/login`
3. Backend returns JWT token + user info
4. Token + user saved to AsyncStorage
5. User redirected to role-specific dashboard

### AuthContext (context/AuthContext.tsx)
```typescript
useAuth() => {
  user,           // { id, fullName, role, employeeNo }
  token,          // JWT token
  loading,        // Initial auth check loading
  login(),        // Async login function
  logout(),       // Clear auth state
  isSignedIn      // User is authenticated
}
```

### Protected Routes
```typescript
// In _layout.tsx
if (!user && !inAuthGroup) {
  router.replace("/(auth)/login");
} else if (user) {
  switch (user.role) {
    case "admin": router.replace("/(admin)/dashboard");
    case "hrd": router.replace("/(hrd)/dashboard");
    // ... other roles
  }
}
```

## 📊 Dashboard Structure

### Admin Dashboard
- Stats: Total users, total tasks, completed, pending
- Quick Actions: Create user, create task, view users, view tasks
- Team Overview: Manager, supervisor, worker counts
- Recent Tasks: Last 5 tasks with status badges

### HRD Dashboard
- Stats: Total employees, active, inactive
- Quick Actions: Add employee, all employees
- Recent Employees: List of recently added employees

### Manager Dashboard
- Stats: My tasks, pending, in-progress, completed
- My Tasks: Can tap to assign to supervisors
- Modal: Assign to available supervisors

### Supervisor Dashboard
- Stats: My tasks, pending, in-progress, completed
- My Tasks: Can tap to assign to workers
- Modal: Assign to available workers

### Worker Dashboard
- Stats: My tasks, pending, in-progress, completed
- My Tasks: Can tap to update status
- Modal: Update status (pending → in-progress → review → completed)

## 🎨 Styling

All styles use Tailwind-inspired color scheme:
- Dark background: #0f172a
- Surface: #1e293b
- Border: #334155
- Text: #f1f5f9, #94a3b8, #64748b

### Color Palette
```typescript
// Status colors
pending: "#f59e0b"      // Amber
in-progress: "#3b82f6"  // Blue
review: "#8b5cf6"       // Purple
completed: "#10b981"    // Green

// Role colors
admin: "#3b82f6"        // Blue
hrd: "#8b5cf6"          // Purple
manager: "#8b5cf6"      // Purple
supervisor: "#ec4899"   // Pink
worker: "#06b6d4"       // Cyan
```

## 📱 API Integration

### Example: Fetch User's Tasks
```typescript
const fetchData = async () => {
  try {
    const res = await fetch(ENDPOINTS.myTasks, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  } catch {
    Alert.alert("Error", "Failed to fetch tasks");
  }
};
```

### Endpoints Used

| Screen | Endpoint | Method | Auth |
|--------|----------|--------|------|
| Login | `/api/auth/login` | POST | ❌ |
| Create User | `/api/users/create` | POST | ✅ |
| All Users | `/api/users/all` | GET | ✅ |
| Create Task | `/api/tasks/create` | POST | ✅ |
| All Tasks | `/api/tasks/all` | GET | ✅ |
| My Tasks | `/api/tasks/my-tasks` | GET | ✅ |
| User Tasks | `/api/tasks/user/:id` | GET | ✅ |
| Update Status | `/api/tasks/update-status/:id` | PATCH | ✅ |

## 🔄 State Management

### Global State (AuthContext)
```typescript
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);
const [loading, setLoading] = useState(true);

// Persisted to AsyncStorage
// Restored on app launch
```

### Local State (Screen-level)
```typescript
const [tasks, setTasks] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
```

## 🧪 Testing

### Test Login
1. Start backend: `npm start` (in backend folder)
2. Create test user via API or create-user screen
3. Use employee number and password to login
4. Verify redirected to correct dashboard

### Test Task Creation
1. Login as Admin/Manager/Supervisor
2. Go to create task screen
3. Fill form and submit
4. Check worker's dashboard for task

### Test Task Status Update
1. Login as Worker
2. View assigned tasks
3. Tap task to update status
4. Check supervisor's dashboard

## 📦 Dependencies

- **expo** (~54.0) - React Native framework
- **expo-router** (~6.0) - File-based routing
- **react** (19.1) - UI library
- **react-native** (0.81) - Native components
- **axios** - HTTP client (optional, using fetch instead)
- **@react-native-async-storage/async-storage** - Local persistence

## 🐛 Troubleshooting

### "Cannot reach backend"
- Check API_BASE in `constants/api.ts`
- Ensure backend is running: `npm start` in backend folder
- For Android emulator: Use `10.0.2.2` for localhost
- For physical device: Use actual IP address (not localhost)

### "AsyncStorage undefined"
- Ensure `@react-native-async-storage/async-storage` is installed
- Run `npm install` again

### Token expired immediately
- Check JWT_SECRET matches in backend
- Verify token format in authorization header: `Bearer TOKEN`

### Screens not loading
- Check AuthContext is wrapping the app
- Verify navigation route names match folder names
- Check console logs in Expo debugger

### Styles not applying
- Ensure StyleSheet.create() is used
- Check color values match theme
- Verify flexDirection for layout issues

## 💡 Development Tips

### Add New Role
1. Create folder: `app/(newrole)/_layout.tsx`
2. Create dashboard: `app/(newrole)/dashboard.tsx`
3. Create styles: `styles/newrole/dashboard.styles.ts`
4. Update `_layout.tsx` routing switch
5. Update backend User model enum

### Add New Screen
```typescript
// screens/example.tsx
import { useAuth } from "@/context/AuthContext";
import { ENDPOINTS } from "@/constants/api";

export default function ExampleScreen() {
  const { token } = useAuth();
  
  const fetchData = async () => {
    const res = await fetch(ENDPOINTS.endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Handle response
  };
}
```

### Handle Token Expiration
```typescript
if (res.status === 401) {
  // Token expired
  logout();
  router.replace("/(auth)/login");
}
```

## 📸 Screenshots

| Admin Dashboard | Worker Dashboard |
|---|---|
| [Stats, Quick Actions] | [My Tasks, Update Status] |

---

**Last Updated:** April 2026
