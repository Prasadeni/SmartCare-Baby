// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import babyRoutes from './routes/babies.js';
import adminRoutes from './routes/admin.js';
import configRoutes from './routes/configs.js';
import assessmentRoutes from './routes/assessments.js';
import pregnancyRoutes from './routes/pregnancy.js';
import growthRoutes from './routes/growth.js';
import vaccinationRoutes from './routes/vaccinations.js';
import mappingRouter, { specialistsListRouter } from './routes/specialists.js';
import educationRoutes from './routes/education.js';
import chatRoutes from './routes/chat.js';
import historyRoutes from './routes/history.js';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'smartcare-backend', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/babies', babyRoutes);
app.use('/api', configRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/pregnancy', pregnancyRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api', mappingRouter);                        // /api/specialty-mappings
app.use('/api/specialists', specialistsListRouter);    // /api/specialists, /api/specialists/:id
app.use('/api/education', educationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/history', historyRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   CORS allows: ${process.env.CLIENT_ORIGIN}`);
  });
});
