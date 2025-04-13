const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date, // New Field
  },
  category: {
    type: String, // New Field
  },
});

module.exports = mongoose.model('Task', TaskSchema);
