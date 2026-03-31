const Mood = require('../models/Mood');

exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMood = async (req, res) => {
  const { mood, note } = req.body;
  try {
    const moodEntry = await Mood.create({
      userId: req.user.id,
      mood,
      note
    });
    res.json(moodEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findByPk(req.params.id);
    if (!mood) return res.status(404).json({ message: 'Mood entry not found' });
    if (mood.userId !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await mood.destroy();
    res.json({ message: 'Mood entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
