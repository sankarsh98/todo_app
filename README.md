# TaskFlow - Smart Todo App

A beautiful, modern todo application with multi-device sync, Google authentication, and Firebase hosting.

## ✨ Features

- **Google Authentication** - Secure sign-in with Firebase Auth
- **Multi-device Sync** - Real-time sync across all your devices
- **Natural Language Input** - Type "Buy milk tomorrow #shopping p1"
- **Smart Lists** - My Day, Important, Upcoming views
- **Subtasks & Priorities** - Break down tasks with priority levels (1-4)
- **Labels/Tags** - Organize with colorful labels
- **Recurring Tasks** - Daily, weekly, monthly repeats
- **Dark/Light Theme** - System preference detection
- **Offline Support** - Works without internet (IndexedDB)
- **Responsive Design** - Desktop sidebar, mobile bottom nav

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Google Authentication
3. Create a Firestore database
4. Copy your config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Deploy to Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/          # Google sign-in page
│   ├── Layout/        # Sidebar, MobileNav
│   └── Tasks/         # TaskItem, TaskList, QuickAdd, TaskModal
├── views/             # MyDay, Important, Upcoming, AllTasks, Completed
├── context/           # AuthContext, TaskContext, ThemeContext
├── firebase/          # config.js, auth.js, firestore.js
└── hooks/             # useNaturalLanguage
```

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Vanilla CSS with CSS Variables
- **Backend**: Firebase (Auth + Firestore)
- **Hosting**: Firebase Hosting

## 📝 License

MIT
