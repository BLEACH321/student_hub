const aiService = require('../services/aiService');

exports.summarize = async (req, res) => {
  const { notes } = req.body;
  if (!notes) return res.status(400).json({ message: 'Notes are required' });

  try {
    const summary = await aiService.summarizeNotes(notes);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudyPlan = async (req, res) => {
  const { tasks } = req.body;
  if (!tasks) return res.status(400).json({ message: 'Tasks are required' });

  try {
    const plan = await aiService.generateStudyPlan(tasks);
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
