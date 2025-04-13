
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const taskRoutes = require('./routes/taskRoutes'); // ✅ Your file

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Parse JSON body

// Mount the router correctly
app.use('/api/tasks', taskRoutes); // ✅ This MUST match the Axios URL

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
