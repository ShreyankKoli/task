const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { Op } = require('sequelize');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, due_date, status, priority } = req.body;
    
    // Validate due_date is not in the past
    if (new Date(due_date) < new Date()) {
      return res.status(400).json({ error: 'Due date cannot be in the past' });
    }

    const newTask = await Task.create({ title, description, due_date, status, priority });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Title must be unique' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update task status
router.put('/:id/status', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const nextStatusMap = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Completed',  // stays completed
    };

    task.status = nextStatusMap[task.status] || 'Pending';
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating status' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
