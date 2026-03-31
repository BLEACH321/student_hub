import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, TrendingDown, TrendingUp, DollarSign, Coffee, Book, Bus, ShoppingBag, Pizza, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useApi } from '../hooks/useApi';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  icon: string;
}

const categories = [
  { name: 'Food', icon: Pizza, color: '#4A90E2' },
  { name: 'Transport', icon: Bus, color: '#6EC6FF' },
  { name: 'Books', icon: Book, color: '#8b5cf6' },
  { name: 'Coffee', icon: Coffee, color: '#ec4899' },
  { name: 'Shopping', icon: ShoppingBag, color: '#f59e0b' },
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { request, loading } = useApi();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Food',
  });

  const fetchExpenses = async () => {
    try {
      const data = await request('/expenses');
      setExpenses(data.map((e: any) => ({
        ...e,
        id: e.id || e._id,
        icon: categories.find((c) => c.name === e.category)?.icon.name || 'DollarSign'
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [request]);

  const addExpense = async () => {
    if (newExpense.title && newExpense.amount) {
      try {
        const body = {
          title: newExpense.title,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: new Date().toISOString()
        };
        const data = await request('/expenses', 'POST', body);
        setExpenses([{
          ...data,
          id: data.id || data._id,
          icon: categories.find((c) => c.name === data.category)?.icon.name || 'DollarSign'
        }, ...expenses]);
        setNewExpense({ title: '', amount: '', category: 'Food' });
        setShowAddModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = days.map((day, index) => {
    const amount = expenses
      .filter((exp) => new Date(exp.date).getDay() === index)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { day, amount };
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisWeekExpenses = expenses
    .filter((exp) => new Date(exp.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    value: expenses.filter((exp) => exp.category === cat.name).reduce((sum, exp) => sum + exp.amount, 0),
    color: cat.color,
  }));

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Pizza, Bus, Book, Coffee, ShoppingBag };
    return icons[iconName] || DollarSign;
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Expenses</h1>
        <p className="text-muted-foreground">Track your spending</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="bg-card rounded-3xl p-5 neu-shadow-light">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <div className="text-3xl">${totalExpenses.toFixed(2)}</div>
        </div>
        <div className="bg-card rounded-3xl p-5 neu-shadow-light">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-muted-foreground">This Week</span>
          </div>
          <div className="text-3xl">${thisWeekExpenses.toFixed(2)}</div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl mb-4">Weekly Overview</h2>
        <div className="bg-card rounded-3xl p-6 neu-shadow-light">
          {loading && expenses.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A90E2" />
                    <stop offset="100%" stopColor="#6EC6FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl mb-4">By Category</h2>
        <div className="bg-card rounded-3xl p-6 neu-shadow-light">
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryData.filter((cat) => cat.value > 0).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm">{cat.name}</span>
                </div>
                <span className="text-sm">${cat.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Add Expense Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="w-full mb-6 py-4 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl neu-shadow-light flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Expense</span>
      </motion.button>

      {/* Recent Expenses */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl mb-4 font-bold">Recent Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expenses.slice(0, 10).map((expense, index) => {
            const IconComponent = getIconComponent(expense.icon);
            const categoryColor = categories.find((c) => c.name === expense.category)?.color || '#4A90E2';
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-card rounded-2xl p-4 neu-shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${categoryColor}20` }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: categoryColor }} />
                  </div>
                  <div>
                    <h3 className="mb-1">{expense.title}</h3>
                    <p className="text-xs text-muted-foreground">{expense.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg">-${expense.amount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-6"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-3xl p-6 neu-shadow-light"
            >
              <h2 className="text-2xl mb-6">Add Expense</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    placeholder="What did you buy?"
                    className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setNewExpense({ ...newExpense, category: cat.name })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                          newExpense.category === cat.name
                            ? 'bg-gradient-to-br from-primary to-secondary text-white'
                            : 'bg-background neu-shadow-inset'
                        }`}
                      >
                        <cat.icon className="w-5 h-5" />
                        <span className="text-xs">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-background rounded-xl neu-shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addExpense}
                    className="flex-1 py-3 bg-gradient-to-br from-primary to-secondary text-white rounded-xl neu-shadow-light"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
