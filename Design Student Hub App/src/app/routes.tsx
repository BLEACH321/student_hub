import { createBrowserRouter } from 'react-router';
import { Layout } from './components';
import {
  Splash,
  Auth,
  Dashboard,
  TaskManager,
  MoodTracker,
  ExpenseTracker,
  Flashcards,
  Calendar,
  FocusTimer,
  Settings,
  NotFound,
} from './screens';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Splash />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/app',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'tasks', element: <TaskManager /> },
      { path: 'mood', element: <MoodTracker /> },
      { path: 'expenses', element: <ExpenseTracker /> },
      { path: 'flashcards', element: <Flashcards /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'focus', element: <FocusTimer /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);