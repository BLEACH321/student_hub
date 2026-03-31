import { motion } from 'motion/react';
import { CheckSquare, Smile, DollarSign, Timer, TrendingUp, Calendar as CalendarIcon, Bookmark, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { useApi } from '../hooks/useApi';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const statsCards = [
  {
    title: 'Tasks',
    value: '12',
    subtitle: '4 pending',
    icon: CheckSquare,
    color: 'from-blue-500 to-blue-600',
    path: '/app/tasks',
  },
  {
    title: 'Mood',
    value: '😊',
    subtitle: 'Feeling great',
    icon: Smile,
    color: 'from-yellow-500 to-orange-500',
    path: '/app/mood',
  },
  {
    title: 'Expenses',
    value: '$234',
    subtitle: 'This week',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    path: '/app/expenses',
  },
  {
    title: 'Focus Time',
    value: '2.5h',
    subtitle: 'Today',
    icon: Timer,
    color: 'from-purple-500 to-pink-500',
    path: '/app/focus',
  },
];

const quickLinks = [
  { title: 'Flashcards', icon: Bookmark, path: '/app/flashcards', color: 'text-blue-500' },
  { title: 'Calendar', icon: CalendarIcon, path: '/app/calendar', color: 'text-green-500' },
  { title: 'Focus Timer', icon: Timer, path: '/app/focus', color: 'text-purple-500' },
];

const recentActivity = [
  { text: 'Completed "Math Assignment"', time: '2 hours ago' },
  { text: 'Added $15 coffee expense', time: '3 hours ago' },
  { text: 'Studied for 45 minutes', time: '5 hours ago' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { request, loading } = useApi();
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiInsight = async () => {
      try {
        const data = await request('/ai/summarize', 'POST', { notes: "User has 4 pending tasks and a high study goal for the week." });
        setAiInsight(data.summary);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAiInsight();
  }, [request]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
            <p className="text-muted-foreground text-lg">Here's what's happening with your studies today.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 p-4 bg-card rounded-3xl neu-shadow-sm">
             <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Premium Plan</p>
             </div>
             <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{user?.name?.charAt(0) || 'S'}</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.button
            key={card.title}
            onClick={() => navigate(card.path)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-card rounded-3xl p-6 neu-shadow-light text-left transition-all hover:bg-muted/50"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{card.title}</div>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-sm text-muted-foreground">{card.subtitle}</div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* main span 2 */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 neu-shadow-light border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-24 h-24 text-primary" />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-primary/20 rounded-xl text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">AI Study Insights</h3>
            </div>
            {loading ? (
              <div className="flex items-center gap-3 text-muted-foreground relative z-10">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing your performance...</span>
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-muted-foreground relative z-10 italic">
                "{aiInsight || "Your learning pattern is looking consistent! Try focusing on your 'Math Assignment' today to maintain your streak."}"
              </p>
            )}
            <div className="mt-8 flex gap-4 relative z-10">
                <button className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">Get Detailed Plan</button>
                <button className="px-6 py-2 bg-background/50 rounded-xl text-sm font-medium hover:bg-background transition-colors">See Performance History</button>
            </div>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-3xl p-8 neu-shadow-light"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Development Progress</h3>
              <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">+12.5%</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-medium text-muted-foreground">Major Tasks</span>
                    <span className="text-primary font-bold">8 / 12</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '67%' }}
                      transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-medium text-muted-foreground">Study Hours Goal</span>
                    <span className="text-purple-500 font-bold">12.5 / 20</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '62.5%' }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-muted/30 rounded-3xl border border-dashed border-border">
                  <div className="text-center">
                      <p className="text-3xl font-bold text-primary mb-1">Excellent</p>
                      <p className="text-sm text-muted-foreground">You are in the top 5% of active students this week!</p>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar area span 1 */}
        <div className="space-y-8">
          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-3xl p-6 neu-shadow-light"
          >
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={link.title}
                  onClick={() => navigate(link.path)}
                  className="w-full flex items-center gap-4 p-4 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-colors group"
                >
                  <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center neu-shadow-sm group-hover:scale-110 transition-transform">
                    <link.icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <span className="font-medium">{link.title}</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card rounded-3xl p-6 neu-shadow-light"
          >
            <h3 className="text-xl font-bold mb-6">Activity Feed</h3>
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full relative z-10">
                        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
                    </div>
                    {index !== recentActivity.length - 1 && <div className="w-0.5 h-full bg-border -mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors border-t border-border mt-2">
                View All Activity
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
