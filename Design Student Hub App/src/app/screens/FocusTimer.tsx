import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

export function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break' | 'longBreak'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerSettings = {
    focus: 25,
    break: 5,
    longBreak: 15,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            setIsActive(false);
            if (mode === 'focus') {
              setSessionsCompleted((prev) => prev + 1);
              // After 4 focus sessions, take a long break
              if ((sessionsCompleted + 1) % 4 === 0) {
                setMode('longBreak');
                setMinutes(timerSettings.longBreak);
              } else {
                setMode('break');
                setMinutes(timerSettings.break);
              }
            } else {
              setMode('focus');
              setMinutes(timerSettings.focus);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, sessionsCompleted]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(timerSettings[mode]);
    setSeconds(0);
  };

  const switchMode = (newMode: 'focus' | 'break' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(timerSettings[newMode]);
    setSeconds(0);
  };

  const totalSeconds = timerSettings[mode] * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return { from: '#4A90E2', to: '#6EC6FF' };
      case 'break':
        return { from: '#10b981', to: '#34d399' };
      case 'longBreak':
        return { from: '#8b5cf6', to: '#a78bfa' };
    }
  };

  const modeColor = getModeColor();

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Focus Timer</h1>
        <p className="text-muted-foreground">Stay productive with Pomodoro</p>
      </motion.div>

      {/* Mode Switcher */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8 p-2 bg-card rounded-2xl neu-shadow-inset"
      >
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-3 rounded-xl transition-all ${
            mode === 'focus' ? 'bg-gradient-to-br from-primary to-secondary text-white' : ''
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-3 rounded-xl transition-all ${
            mode === 'break' ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : ''
          }`}
        >
          Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-3 rounded-xl transition-all ${
            mode === 'longBreak' ? 'bg-gradient-to-br from-purple-500 to-purple-400 text-white' : ''
          }`}
        >
          Long Break
        </button>
      </motion.div>

      {/* Circular Timer */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-8"
      >
        <div className="relative">
          <svg className="transform -rotate-90" width="280" height="280">
            {/* Background Circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="140"
              cy="140"
              r="120"
              stroke={`url(#gradient-${mode})`}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <defs>
              <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={modeColor.from} />
                <stop offset="100%" stopColor={modeColor.to} />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl mb-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground capitalize">{mode.replace('longBreak', 'Long Break')}</div>
          </div>
        </div>
      </motion.div>

      {/* Control Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        <motion.button
          onClick={resetTimer}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-card rounded-2xl neu-shadow-sm flex items-center justify-center"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={toggleTimer}
          whileTap={{ scale: 0.95 }}
          className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl neu-shadow-light flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${modeColor.from}, ${modeColor.to})`,
          }}
        >
          {isActive ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-card rounded-2xl neu-shadow-sm flex items-center justify-center"
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-3xl p-6 neu-shadow-light mb-8"
      >
        <h2 className="text-xl mb-4">Today's Progress</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-1">{sessionsCompleted}</div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">{sessionsCompleted * 25}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-sm text-muted-foreground">Streak</div>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-3xl p-6 neu-shadow-light"
      >
        <h2 className="text-xl mb-4">Pomodoro Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm">1</span>
            </div>
            <p className="text-sm text-muted-foreground">Work with full focus for 25 minutes</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm">2</span>
            </div>
            <p className="text-sm text-muted-foreground">Take a 5-minute break to recharge</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm">3</span>
            </div>
            <p className="text-sm text-muted-foreground">After 4 sessions, take a 15-minute break</p>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
