import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, CheckSquare, Smile, DollarSign, Bookmark, Calendar as CalendarIcon, Timer, Settings as SettingsIcon, Plus, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/app', icon: Home, label: 'Home' },
  { path: '/app/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/app/mood', icon: Smile, label: 'Mood' },
  { path: '/app/expenses', icon: DollarSign, label: 'Expenses' },
  { path: '/app/calendar', icon: CalendarIcon, label: 'Calendar' },
  { path: '/app/settings', icon: SettingsIcon, label: 'Settings' },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, loading } = useAuth();
  const [showFab, setShowFab] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    { label: 'Add Task', icon: CheckSquare, path: '/app/tasks' },
    { label: 'Track Mood', icon: Smile, path: '/app/mood' },
    { label: 'Add Expense', icon: DollarSign, path: '/app/expenses' },
    { label: 'Focus Time', icon: Timer, path: '/app/focus' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">SH</span>
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Student Hub</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="md:hidden p-4 bg-card border-b border-border flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">SH</span>
              </div>
              <span className="font-semibold">Student Hub</span>
            </div>
            <button onClick={() => navigate('/app/settings')} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
            </button>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile FAB */}
        <AnimatePresence>
          {showFab && (
            <motion.div
              className="md:hidden fixed bottom-24 right-6 z-50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <AnimatePresence>
                {fabOpen && (
                  <motion.div
                    className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.label}
                        onClick={() => {
                          navigate(action.path);
                          setFabOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 bg-card rounded-2xl neu-shadow-sm hover:opacity-90 transition-opacity"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="text-sm whitespace-nowrap">{action.label}</span>
                        <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => setFabOpen(!fabOpen)}
                className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg"
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: fabOpen ? 45 : 0 }}
              >
                <Plus className="w-6 h-6 text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
          <div className="flex items-center justify-around px-4 py-3">
            {navItems.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                    />
                  )}
                  <item.icon
                    className={`w-5 h-5 relative z-10 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <span
                    className={`text-[10px] relative z-10 ${
                      isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
