import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export function Flashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const { request, loading } = useApi();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    category: '',
  });

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  const fetchCards = async () => {
    try {
      const data = await request('/flashcards');
      setCards(data.map((c: any) => ({
        id: c.id || c._id,
        front: c.question,
        back: c.answer,
        category: c.category
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [request]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const addCard = async () => {
    if (newCard.front && newCard.back) {
      try {
        const body = {
          question: newCard.front,
          answer: newCard.back,
          category: newCard.category || 'General'
        };
        const data = await request('/flashcards', 'POST', body);
        const card: Flashcard = {
          id: data.id || data._id,
          front: data.question,
          back: data.answer,
          category: data.category
        };
        setCards([...cards, card]);
        setNewCard({ front: '', back: '', category: '' });
        setShowAddModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await request(`/flashcards/${id}`, 'DELETE');
      const updatedCards = cards.filter((card) => card.id !== id);
      setCards(updatedCards);
      if (currentIndex >= updatedCards.length) {
        setCurrentIndex(Math.max(0, updatedCards.length - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Flashcards</h1>
        <p className="text-muted-foreground">
          {currentIndex + 1} of {cards.length} cards
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 h-2 bg-card rounded-full overflow-hidden neu-shadow-inset"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Flashcard */}
      {cards.length > 0 && currentCard && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative perspective-1000" style={{ perspective: '1000px' }}>
            <motion.div
              onClick={handleFlip}
              className="relative h-96 cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 bg-card rounded-3xl p-8 neu-shadow-light flex flex-col items-center justify-center backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-sm text-primary mb-4 px-4 py-2 bg-primary/10 rounded-full">
                  {currentCard.category}
                </div>
                <p className="text-xl text-center">{currentCard.front}</p>
                <p className="text-sm text-muted-foreground mt-8">Tap to reveal answer</p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 neu-shadow-light flex flex-col items-center justify-center backface-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="text-sm text-white/80 mb-4">Answer</div>
                <p className="text-xl text-white text-center">{currentCard.back}</p>
                <p className="text-sm text-white/70 mt-8">Tap to see question</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Navigation Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        <motion.button
          onClick={handlePrevious}
          disabled={cards.length === 0}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-card rounded-2xl neu-shadow-sm flex items-center justify-center disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={handleFlip}
          disabled={cards.length === 0}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl neu-shadow-light disabled:opacity-50"
        >
          Flip Card
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={cards.length === 0}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-card rounded-2xl neu-shadow-sm flex items-center justify-center disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <button
          onClick={resetProgress}
          className="py-3 bg-card rounded-2xl neu-shadow-sm flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="py-3 bg-card rounded-2xl neu-shadow-sm flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          <span>Add Card</span>
        </button>
      </motion.div>

      {/* All Cards List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl mb-4">All Cards</h2>
        {loading && cards.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card rounded-2xl p-4 neu-shadow-sm ${
                  index === currentIndex ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-primary mb-1">{card.category}</div>
                    <p className="text-sm mb-1">{card.front}</p>
                    <p className="text-xs text-muted-foreground">{card.back.slice(0, 50)}...</p>
                  </div>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="text-destructive hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Card Modal */}
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
              <h2 className="text-2xl mb-6">Add New Card</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Question (Front)</label>
                  <textarea
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                    placeholder="Enter your question"
                    rows={3}
                    className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Answer (Back)</label>
                  <textarea
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                    placeholder="Enter the answer"
                    rows={3}
                    className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Category</label>
                  <input
                    type="text"
                    value={newCard.category}
                    onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
                    placeholder="e.g., Math, Physics, History"
                    className="w-full px-4 py-3 bg-background rounded-xl neu-shadow-inset focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-background rounded-xl neu-shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCard}
                    className="flex-1 py-3 bg-gradient-to-br from-primary to-secondary text-white rounded-xl neu-shadow-light"
                  >
                    Add Card
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
