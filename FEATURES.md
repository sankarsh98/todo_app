# TaskFlow Features

A comprehensive overview of all features available in TaskFlow - the smart todo application.

---

## 🔐 Authentication & Security

### Google Sign-In
- One-click sign-in with Google account
- Secure Firebase Authentication
- Automatic sign-out across devices
- User profile with avatar display

### Data Security
- All data stored in Firebase Firestore
- User-specific data isolation (Firestore security rules)
- No data accessible without authentication

---

## ✅ Task Management

### Creating Tasks
- **Quick Add** - Always-visible input for fast task creation
- **Natural Language Input** - Parse dates, times, priorities, labels from text
  - `tomorrow` / `today` / `next week`
  - `26 jan` / `jan 26` / `10 sept 2025`
  - `monday` / `next friday`
  - `@3pm` / `at 2:30` / `3.30pm`
  - `p1` / `p2` / `p3` (priority)
  - `#label` (tags)
  - `daily` / `every week` / `every monday`

### Task Properties
- **Title** - Task name
- **Description** - Additional details
- **Due Date** - When the task is due
- **Due Time** - Specific time with reminder flag
- **Priority** (1-4) - High, Medium, Low, None
- **Labels** - Color-coded categories
- **Subtasks** - Break down into smaller steps
- **My Day** - Focus flag for today

### Task Actions
- ✓ Mark complete/incomplete
- 📝 Edit all properties
- 🗑️ Delete tasks
- 📌 Add to My Day
- ⭐ Star as important (priority 1)

---

## 🔄 Recurring Tasks

### Supported Frequencies
| Pattern | Description |
|---------|-------------|
| `daily` / `every day` | Repeats every day |
| `weekly` / `every week` | Repeats every 7 days |
| `monthly` / `every month` | Repeats on same day each month |
| `yearly` / `every year` | Repeats annually |
| `every monday` | Specific day each week |
| `weekdays` | Monday through Friday |
| `weekends` | Saturday and Sunday |
| `every 3 days` | Custom interval |

### Auto-Creation
When you complete a recurring task, the next occurrence is **automatically created** with the calculated next due date.

---

## 📋 Smart Views

### My Day
- Tasks marked for today's focus
- Overdue tasks section
- One-click add to My Day from any task

### Important
- All high-priority tasks (P1)
- Star icon to mark/unmark

### Upcoming
- Tasks grouped by due date:
  - Overdue
  - Today
  - Tomorrow
  - This Week
  - Later

### All Tasks
- Complete task list
- **Search** by title and description
- **Filter by labels** - Click label chips to filter

### Completed
- Archive of finished tasks
- Toggle back to incomplete if needed

### Label View
- View tasks by specific label
- Tasks created here auto-assigned that label

---

## 🏷️ Labels & Organization

### Label Features
- Create unlimited labels
- Custom colors (16 presets + color picker)
- Rename and change colors anytime
- Delete labels (with confirmation)
- Filter tasks by labels

### On-the-Fly Creation
When adding a task with `#newlabel`, if the label doesn't exist, it's **automatically created** with a random color.

---

## ⏰ Reminders

### Time-Based Reminders
- Add time to any task (`@3pm`, `at 9:30am`)
- Reminder flag automatically enabled when time is set
- Visual 🔔 indicator in task preview

---

## 🌓 Theming

### Dark/Light Mode
- Manual toggle in sidebar
- Persists across sessions
- Smooth transition animations
- Optimized color palette for both modes

---

## 📱 Responsive Design

### Desktop Experience
- Collapsible sidebar navigation
- Expansive task lists
- Keyboard shortcuts

### Mobile Experience
- Bottom navigation bar
- Slide-out menu
- Touch-optimized task controls
- Safe area support (notch/home indicator)
- + button scrolls to and focuses add task input

---

## 🔄 Real-Time Sync

### Multi-Device Support
- Changes sync instantly across devices
- Real-time Firestore subscriptions
- Offline persistence (IndexedDB)
- Conflict-free sync

---

## 🎨 User Interface

### Design Language
- Modern glassmorphism effects
- Smooth micro-animations
- Premium gradient accents
- Accessible color contrast
- Clean typography (Inter font)

### Interactive Elements
- Hover states on all actions
- Visual feedback on interactions
- Loading indicators
- Empty state messages

---

## 🛠️ Technical Features

### Performance
- Vite for fast builds
- Code splitting potential
- Optimized bundle (~200KB gzipped)
- Firebase caching

### Firebase Integration
- Authentication (Google provider)
- Firestore (real-time database)
- Hosting (CDN deployment)
- Security rules enforcement
- Composite indexes for queries

### PWA Ready
- Web app manifest
- Mobile-web-app-capable meta tags
- Standalone display mode

---

## 📊 Data Model

### Task Schema
```javascript
{
  id: string,
  userId: string,
  title: string,
  description: string,
  completed: boolean,
  priority: 1-4,
  dueDate: timestamp,
  hasReminder: boolean,
  recurring: { frequency, interval, dayOfWeek },
  labels: string[],
  subtasks: array,
  inMyDay: boolean,
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Label Schema
```javascript
{
  id: string,
  userId: string,
  name: string,
  color: string
}
```

---

## 🚀 Deployment

- **Hosting**: Firebase Hosting
- **URL**: https://just-do-it-task-flow.web.app
- **Auto-deploy**: GitHub Actions on push to main
