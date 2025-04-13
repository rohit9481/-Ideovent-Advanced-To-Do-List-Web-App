const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ ROUTE REGISTRATION
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`)
  );
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
