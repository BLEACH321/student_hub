import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Flag, Loader2, Sparkles, X, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useApi } from '../hooks/useApi';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { request, loading } = useApi();
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });

  const fetchTasks = async () => {
    try {
      const data = await request('/tasks');
      // Fix: Backend now uses 'id' instead of '_id' after SQLite migration
      setTasks(data.map((t: any) => ({ ...t, id: t.id || t._id })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [request]);

  const addTask = async () => {
    if (newTask.title.trim()) {
      try {
        const data = await request('/tasks', 'POST', newTask);
        const taskWithId = { ...data, id: data.id || data._id };
        setTasks([taskWithId, ...tasks]);
        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
        setShowAddModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const data = await request(`/tasks/${id}`, 'PUT', { completed: !completed });
      const updatedTask = { ...data, id: data.id || data._id };
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await request(`/tasks/${id}`, 'DELETE');
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 border-red-500/20 bg-red-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
      case 'low': return 'text-green-500 border-green-500/20 bg-green-500/10';
    }
  };

  const generateStudyPlan = async () => {
    if (activeTasks.length === 0) return;
    setIsGeneratingPlan(true);
    try {
      const data = await request('/ai/study-plan', 'POST', { tasks: activeTasks });
      setAiPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks & Activities</h1>
          <p className="text-muted-foreground">
            You have <span className="text-primary font-bold">{activeTasks.length}</span> active tasks to focus on today.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex bg-card rounded-xl p-1 neu-shadow-sm mr-2">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground'}`}
                >
                    <List className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground'}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
            </div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 font-medium"
            >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
            </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
           {/* AI Study Plan Prompt */}
          {activeTasks.length > 0 && !aiPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Struggling to prioritize?</h3>
                  <p className="text-sm text-muted-foreground">Let AI generate a customized study plan based on your active tasks.</p>
                </div>
              </div>
              <button
                onClick={generateStudyPlan}
                disabled={isGeneratingPlan}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium flex items-center gap-2 whitespace-nowrap"
              >
                {isGeneratingPlan ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Generate Plan
              </button>
            </motion.div>
          )}

          {/* AI Plan Result */}
          {aiPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-3xl p-8 neu-shadow-light border border-primary/30 relative"
            >
              <button 
                onClick={() => setAiPlan(null)}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                title="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Your AI Study Plan</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground italic leading-relaxed whitespace-pre-wrap">{aiPlan}</p>
              </div>
            </motion.div>
          )}

          {/* Task Lists */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              Active Focus
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{activeTasks.length}</span>
            </h2>
            
            {activeTasks.length === 0 && !loading && (
                <div className="bg-card rounded-3xl p-12 text-center border-2 border-dashed border-border">
                    <p className="text-muted-foreground">No active tasks. Time to relax or set new goals!</p>
                </div>
            )}

            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              <AnimatePresence mode="popLayout">
                {activeTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-card rounded-2xl p-5 neu-shadow-light border border-transparent hover:border-primary/20 transition-all flex items-start gap-4 group"
                  >
                    <button
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="mt-1 text-muted-foreground hover:text-primary transition-all transform hover:scale-110"
                    >
                      <Circle className="w-6 h-6" />
                    </button>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-[10px] font-bold text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                          <Flag className="w-3 h-3" />
                          {task.priority}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div className="space-y-6 pt-4">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium">
                  <h2 className="text-xl font-bold">Completed Activities</h2>
                  <ChevronRight className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {completedTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 grayscale"
                    >
                      <button
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="text-primary"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-medium truncate line-through">{task.title}</h3>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Controls */}
        <aside className="hidden xl:block space-y-6">
            <div className="bg-card rounded-3xl p-6 neu-shadow-light">
                <h3 className="font-bold mb-4">Task Analytics</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="font-bold text-primary">
                            {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                        </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
                <h3 className="font-bold mb-2">Productivity Tip</h3>
                <p className="text-sm text-white/80 leading-relaxed italic">
                    "Deep work is the superpower of the 21st century. Try focusing on your high-priority tasks in the first 2 hours of your day."
                </p>
            </div>
        </aside>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-[2.5rem] p-8 shadow-2xl border border-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                   <div className="w-32 h-32 bg-primary rounded-full blur-3xl" />
              </div>

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">New Priority</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    autoFocus
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="E.g., Complete Research Paper"
                    className="w-full px-5 py-4 bg-muted/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Brief Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="What needs to be done?"
                    rows={3}
                    className="w-full px-5 py-4 bg-muted/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Priority</label>
                    <div className="flex bg-muted/30 p-1.5 rounded-2xl gap-1">
                      {(['low', 'medium', 'high'] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => setNewTask({ ...newTask, priority })}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
                            newTask.priority === priority
                              ? 'bg-primary text-white shadow-lg'
                              : 'text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Deadline</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-5 py-3 bg-muted/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 font-bold text-muted-foreground hover:bg-muted rounded-2xl transition-all"
                  >
                    Discard
                  </button>
                  <button
                    onClick={addTask}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:opacity-90 transition-all"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
