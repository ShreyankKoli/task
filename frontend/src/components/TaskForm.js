import { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!task.title.trim()) {
      return 'Title is required';
    }
    if (task.title.trim().length < 3) {
      return 'Title must be at least 3 characters';
    }
    if (!task.due_date) {
      return 'Due date is required';
    }
    const due = new Date(task.due_date);
    const now = new Date();
    if (isNaN(due.getTime())) {
      return 'Due date is invalid';
    }
    if (due <= now) {
      return 'Due date must be in the future';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onAdd(task);
      setTask({ title: '', description: '', due_date: '', priority: 'Medium' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Task</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Title"
      /><br />

      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
      /><br />

      <input
        type="datetime-local"
        name="due_date"
        value={task.due_date}
        onChange={handleChange}
      /><br />

      <select name="priority" value={task.priority} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select><br />

      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
