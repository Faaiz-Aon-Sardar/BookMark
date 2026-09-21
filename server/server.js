import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import bookmarkRoutes from './routes/bookmarks.js';
import collectionRoutes from './routes/collections.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/search', searchRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Bookmark Launcher API is running');
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
