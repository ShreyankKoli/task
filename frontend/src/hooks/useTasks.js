import { useState, useEffect } from 'react';
import axios from 'axios';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(false);

  const fetchTasks = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await axios.get(`http://localhost:3001/tasks?${params}`);
    setTasks(res.data);
  };

  const addTask = async (task) => {
    try {
      await axios.post('http://localhost:3001/tasks', task);
      setReload(!reload);
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (id) => {
    await axios.put(`http://localhost:3001/tasks/${id}/status`);
    setReload(!reload);
  };

  useEffect(() => {
    fetchTasks();
  }, [reload]);

  return { tasks, fetchTasks, addTask, updateStatus };
};

export default useTasks;
