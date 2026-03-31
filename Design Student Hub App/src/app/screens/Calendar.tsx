import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';

interface Event {
  id: string;
  title: string;
  date: string;
  color: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const { request, loading } = useApi();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', color: '#4A90E2' });

  const colors = ['#4A90E2', '#6EC6FF', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const fetchEvents = async () => {
    try {
      const data = await request('/calendar');
      setEvents(data.map((e: any) => ({
        id: e._id,
        title: e.title,
        date: new Date(e.start).toISOString().split('T')[0],
        color: e.color || '#4A90E2'
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [request]);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    return events.filter((event) => event.date === dateStr);
  };

  const addEvent = async () => {
    if (newEvent.title && newEvent.date) {
      try {
        const body = {
          title: newEvent.title,
          start: new Date(newEvent.date).toISOString(),
          end: new Date(newEvent.date).toISOString(),
          color: newEvent.color
        };
        const data = await request('/calendar', 'POST', body);
        const event: Event = {
          id: data._id,
          title: data.title,
          date: new Date(data.start).toISOString().split('T')[0],
          color: data.color
        };
        setEvents([...events, event]);
        setNewEvent({ title: '', date: '', color: '#4A90E2' });
        setShowAddModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Calendar</h1>
        <p className="text-muted-foreground">Plan your schedule</p>
      </motion.div>

      {/* Calendar Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-6 neu-shadow-light mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="w-10 h-10 bg-background rounded-xl neu-shadow-sm flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="w-10 h-10 bg-background rounded-xl neu-shadow-sm flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEvents = getEventsForDate(day);
            const today = new Date();
            const isToday =
              day === today.getDate() && 
              currentDate.getMonth() === today.getMonth() && 
              currentDate.getFullYear() === today.getFullYear();

            return (
              <motion.button
                key={day}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + (index + startingDayOfWeek) * 0.01 }}
                onClick={() =>
                  setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                }
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isToday
                    ? 'bg-gradient-to-br from-primary to-secondary text-white'
                    : 'bg-background neu-shadow-inset hover:neu-shadow-sm'
                }`}
              >
                <span className="text-sm">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: isToday ? 'white' : event.color }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Add Event Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="w-full mb-6 py-4 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl neu-shadow-light flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Event</span>
      </motion.button>

      {/* Upcoming Events */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-card rounded-2xl p-4 neu-shadow-sm flex items-center gap-4"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <h3 className="mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Add Event Modal */}
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
              <h2 className="text-2xl mb-6">Add Event</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Color</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewEvent({ ...newEvent, color })}
                        className={`w-10 h-10 rounded-xl transition-all ${
                          newEvent.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
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
                    onClick={addEvent}
                    className="flex-1 py-3 bg-gradient-to-br from-primary to-secondary text-white rounded-xl neu-shadow-light"
                  >
                    Add Event
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
