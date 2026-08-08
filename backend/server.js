require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const publicRoutes = require('./routes/publicRoutes');
const teamRoutes = require('./routes/teamRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const reportRoutes = require('./routes/reportRoutes');
const contentRoutes = require('./routes/contentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "SOA Ideathon API is running" });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
