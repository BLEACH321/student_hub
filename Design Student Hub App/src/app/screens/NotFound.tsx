import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background px-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="text-9xl mb-4"
        >
          🤔
        </motion.div>
        <h1 className="text-6xl mb-4 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Oops! Looks like you're lost in the study void.
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-card rounded-2xl neu-shadow-sm flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/app')}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl neu-shadow-light flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
