const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { userId: req.user.id } });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, start, end, location, allDay } = req.body;
  try {
    const event = await Event.create({
      userId: req.user.id,
      title,
      description,
      start,
      end,
      location,
      allDay
    });
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  const { title, description, start, end, location, allDay } = req.body;
  try {
    let event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.userId !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await event.update({ title, description, start, end, location, allDay });
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.userId !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await event.destroy();
    res.json({ message: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
