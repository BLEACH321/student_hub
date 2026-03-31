const Flashcard = require('../models/Flashcard');

exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(flashcards);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createFlashcard = async (req, res) => {
  const { question, answer, category } = req.body;
  try {
    const flashcard = await Flashcard.create({
      userId: req.user.id,
      question,
      answer,
      category
    });
    res.json(flashcard);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFlashcard = async (req, res) => {
  const { question, answer, category, nextReview } = req.body;
  try {
    let flashcard = await Flashcard.findByPk(req.params.id);
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });
    if (flashcard.userId !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await flashcard.update({ question, answer, category, nextReview });
    res.json(flashcard);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findByPk(req.params.id);
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });
    if (flashcard.userId !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await flashcard.destroy();
    res.json({ message: 'Flashcard removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
