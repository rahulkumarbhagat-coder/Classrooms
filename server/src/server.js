import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { quizRouter } from '../routes/quizRoute.js';
import { authRouter } from '../routes/authRoutes.js';
import { classRouter } from '../routes/classRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to your MERN application' });
});

app.use('/quiz', quizRouter);
app.use('/auth', authRouter);
app.use('/class', classRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});