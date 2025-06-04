import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/tasks');
      setTasks(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update status to next stage
  const updateStatus = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3001/tasks/${id}/status`);
      const updated = tasks.map(task => (task.id === id ? res.data : task));
      setTasks(updated);
      setFiltered(updated);
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating status');
    }
  };

  // Add a new task with validations
  const addTask = async (newTask) => {
    try {
      // Frontend validations
      if (!newTask.title.trim()) throw new Error("Title is required.");
      if (!newTask.due_date) throw new Error("Due date is required.");
      const dueDate = new Date(newTask.due_date);
      const now = new Date();
      if (dueDate < now) throw new Error("Due date must be in the future.");
      if (tasks.some(task => task.title.toLowerCase() === newTask.title.toLowerCase())) {
        throw new Error("Task with this title already exists.");
      }

      // Send to backend
      const res = await axios.post('http://localhost:3001/tasks', newTask);
      const updated = [...tasks, res.data];
      setTasks(updated);
      setFiltered(updated);
      setErrorMessage('');
    } catch (err) {
      const errorText = err.response?.data?.error || err.message || 'Error adding task';
      setErrorMessage(errorText);
    }
  };

  // Filter tasks
  const filterTasks = (criteria) => {
    if (Object.keys(criteria).length === 0) {
      setFiltered(tasks);
    } else if (criteria.priority) {
      setFiltered(tasks.filter(task => task.priority === criteria.priority));
    } else if (criteria.dueSoon) {
      const now = new Date();
      const in3Days = new Date();
      in3Days.setDate(now.getDate() + 3);
      setFiltered(tasks.filter(task => new Date(task.due_date) <= in3Days));
    }
  };

  return (
    <div className="container">
      <h1>Task Management</h1>

      <div className="form-section">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <TaskForm onAdd={addTask} />
      </div>

      <TaskFilters onFilter={filterTasks} />
      <TaskList tasks={filtered} onUpdate={updateStatus} />
    </div>
  );
}

export default App;
