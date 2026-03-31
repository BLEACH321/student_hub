const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/moods', require('./routes/moods'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/ai', require('./routes/ai'));

app.get('/api', (req, res) => {
  res.json({ message: 'Student Hub API is running' });
});

// Sync Database helper
const syncDB = async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized');
    } catch (err) {
        console.error('Failed to synchronize database:', err);
    }
};

// Start Server locally
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    syncDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
} else {
    // On Vercel, we sync DB per request or assume it's synced.
    // For Sequelize, it's safer to ensure a sync check on start.
    syncDB();
}

module.exports = app;
