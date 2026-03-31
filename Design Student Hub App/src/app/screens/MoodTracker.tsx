import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApi } from '../hooks/useApi';
import { Loader2 } from 'lucide-react';

interface MoodEntry {
  id: string;
  emoji: string;
  mood: string;
  note: string;
  date: string;
  time: string;
}

const moods = [
  { emoji: '😄', label: 'Amazing', color: 'from-green-400 to-emerald-500' },
  { emoji: '😊', label: 'Happy', color: 'from-blue-400 to-cyan-500' },
  { emoji: '😐', label: 'Okay', color: 'from-gray-400 to-slate-500' },
  { emoji: '😔', label: 'Sad', color: 'from-indigo-400 to-purple-500' },
  { emoji: '😢', label: 'Terrible', color: 'from-red-400 to-pink-500' },
];

export function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const { request, loading } = useApi();
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchMoods = async () => {
    try {
      const data = await request('/moods');
      setEntries(data.map((m: any) => {
        const moodConfig = moods.find(md => md.label === m.mood) || moods[2];
        const dateObj = new Date(m.date);
        return {
          id: m.id,
          emoji: moodConfig.emoji,
          mood: m.mood,
          note: m.note,
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toTimeString().slice(0, 5),
        };
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, [request]);

  const addMoodEntry = async () => {
    if (selectedMood) {
      try {
        const data = await request('/moods', 'POST', {
          mood: selectedMood.label,
          note
        });
        const dateObj = new Date(data.date);
        const entry: MoodEntry = {
          id: data.id,
          emoji: selectedMood.emoji,
          mood: data.mood,
          note: data.note,
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toTimeString().slice(0, 5),
        };
        setEntries([entry, ...entries]);
        setSelectedMood(null);
        setNote('');
        setShowForm(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Mood Tracker</h1>
        <p className="text-muted-foreground">How are you feeling today?</p>
      </motion.div>

      {/* Mood Selection */}
      {!showForm ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-card rounded-3xl p-6 neu-shadow-light">
            <h2 className="text-xl mb-6 text-center">Select Your Mood</h2>
            <div className="flex justify-between gap-2">
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedMood(mood);
                    setShowForm(true);
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-background transition-all"
                >
                  <div className="text-4xl">{mood.emoji}</div>
                  <span className="text-xs">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="bg-card rounded-3xl p-6 neu-shadow-light">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{selectedMood?.emoji}</div>
              <h2 className="text-2xl mb-2">Feeling {selectedMood?.label}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Add a note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedMood(null);
                    setNote('');
                  }}
                  className="flex-1 py-3 bg-background rounded-xl neu-shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addMoodEntry}
                  className="flex-1 py-3 bg-gradient-to-br from-primary to-secondary text-white rounded-xl neu-shadow-light"
                >
                  Save Mood
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood Statistics */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl mb-4">This Week</h2>
        <div className="bg-card rounded-3xl p-6 neu-shadow-light">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">Average Mood</span>
            <div className="text-3xl">😊</div>
          </div>
          <div className="flex justify-around">
            {moods.slice(0, 5).map((mood, index) => (
              <div key={mood.label} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="text-2xl">{mood.emoji}</div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {Math.floor(Math.random() * 5)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mood History */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl mb-4">History</h2>
        {loading && entries.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl p-4 neu-shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{entry.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3>{entry.mood}</h3>
                      <span className="text-xs text-muted-foreground">{entry.time}</span>
                    </div>
                    {entry.note && <p className="text-sm text-muted-foreground mb-2">{entry.note}</p>}
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
