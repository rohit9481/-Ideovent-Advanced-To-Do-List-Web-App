const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.post('/', async (req, res) => {
  try {
    const { title, dueDate, category } = req.body;

    const newTask = new Task({
      title,
      dueDate,
      category,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all tasks (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    if (category) {
      query.category = category;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ error: 'Server error while updating task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).end();
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
});

module.exports = router;
