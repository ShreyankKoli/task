const Task = require('../models/task');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;
    if (new Date(due_date) < new Date()) {
      return res.status(400).json({ error: 'Due date cannot be in the past' });
    }
    const task = await Task.create({ title, description, due_date, priority });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { priority, dueSoon } = req.query;
    const where = {};
    if (priority === 'High') where.priority = 'High';
    if (dueSoon === 'true') {
      where.due_date = {
        [Op.lte]: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      };
    }
    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

exports.updateStatus = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const order = ['Pending', 'In Progress', 'Completed'];
  const index = order.indexOf(task.status);
  if (index < 2) task.status = order[index + 1];

  await task.save();
  res.json(task);
};
