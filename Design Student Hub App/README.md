# Student Hub – The Smart Student Companion 🎓

A modern, futuristic mobile application designed to help students manage their academic life efficiently. Built with React, TypeScript, and Motion (Framer Motion) with a beautiful neumorphism UI design.

## ✨ Features

### 📱 Complete App Screens
1. **Splash Screen** - Animated logo and tagline
2. **Login/Signup** - Google authentication support
3. **Dashboard** - Overview of tasks, mood, expenses, and focus time
4. **Task Manager** - Add, edit, delete, and track tasks
5. **Mood Tracker** - Emoji-based mood logging with history
6. **Expense Tracker** - Charts and expense management
7. **Flashcards** - Study cards with flip animation
8. **Calendar** - Monthly view with event marking
9. **Focus Timer** - Pomodoro technique timer
10. **Settings** - Profile, dark/light mode, notifications

### 🎨 Design Features
- **Neumorphism UI** - Soft 3D shadows and rounded cards
- **Dark/Light Mode** - Complete theme support
- **Blue Gradient Theme** - From #4A90E2 to #6EC6FF
- **Smooth Animations** - Motion-powered micro-interactions
- **Responsive Design** - Mobile-first approach
- **Clean Typography** - Poppins font family

### 🚀 Navigation
- Bottom navigation bar with animated tabs
- Floating action button for quick actions
- Smooth page transitions
- Auto-hide navigation on scroll

## 🛠️ Tech Stack

- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **React Router 7** - Navigation
- **Motion** (Framer Motion) - Animations
- **Recharts** - Data visualization
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── app/
│   ├── components/      # Reusable components
│   │   ├── Layout.tsx   # Main layout with bottom nav
│   │   ├── NeuCard.tsx  # Neumorphic card component
│   │   └── GradientButton.tsx
│   ├── context/         # React contexts
│   │   └── ThemeContext.tsx
│   ├── hooks/          # Custom hooks
│   │   └── useLocalStorage.ts
│   ├── screens/        # All app screens
│   │   ├── Splash.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TaskManager.tsx
│   │   ├── MoodTracker.tsx
│   │   ├── ExpenseTracker.tsx
│   │   ├── Flashcards.tsx
│   │   ├── Calendar.tsx
│   │   ├── FocusTimer.tsx
│   │   └── Settings.tsx
│   ├── routes.tsx      # Route configuration
│   └── App.tsx         # Root component
└── styles/
    ├── fonts.css       # Font imports
    ├── theme.css       # Theme variables
    └── index.css       # Global styles
```

## 🎯 Key Features Explained

### Task Manager
- Add tasks with priority levels (low, medium, high)
- Set due dates
- Mark tasks as complete/incomplete
- Delete tasks
- View active and completed tasks separately

### Mood Tracker
- Select from 5 emoji-based moods
- Add optional notes
- View mood history
- Weekly mood statistics

### Expense Tracker
- Add expenses by category
- Visual charts (bar chart for weekly, pie chart for categories)
- Category-based organization
- Total and weekly spending overview

### Flashcards
- Create custom flashcards
- Flip animation to reveal answers
- Progress tracking
- Category organization

### Focus Timer
- Pomodoro technique (25-5-15 minutes)
- Circular progress indicator
- Session tracking
- Automatic mode switching

### Calendar
- Monthly view
- Add events with custom colors
- Visual event indicators
- Upcoming events list

## 🎨 Neumorphism Design System

The app uses custom CSS variables for consistent neumorphic shadows:

```css
--neu-shadow-light: 8px 8px 16px rgba(163, 177, 198, 0.4), 
                    -8px -8px 16px rgba(255, 255, 255, 0.8);
--neu-shadow-inset: inset 6px 6px 12px rgba(163, 177, 198, 0.3), 
                    inset -6px -6px 12px rgba(255, 255, 255, 0.7);
--neu-shadow-sm: 4px 4px 8px rgba(163, 177, 198, 0.3), 
                 -4px -4px 8px rgba(255, 255, 255, 0.7);
```

## 🌙 Dark Mode

Full dark mode support with automatic theme switching:
- Persisted in localStorage
- Smooth transitions
- Adjusted neumorphic shadows for dark backgrounds

## 📱 Mobile Optimized

- Max width container (max-w-md)
- Touch-friendly interactions
- Smooth scrolling
- Responsive layouts

## 🎭 Animations

All animations are powered by Motion (Framer Motion):
- Page transitions
- Card reveals
- Button interactions
- Flip animations (flashcards)
- Progress animations

## 💾 Data Persistence

Currently uses localStorage for:
- Theme preferences
- App state (can be extended)

## 🚀 Future Enhancements

Potential features for expansion:
- Backend integration with Supabase
- User authentication
- Cloud sync
- Notifications
- Study statistics
- Goal tracking
- Social features

## 📄 License

This project is created for educational and demonstration purposes.

---

**Built with ❤️ for students everywhere**
