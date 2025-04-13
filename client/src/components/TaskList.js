import React, { useEffect, useState } from 'react';
import API from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  // Load all tasks
  const fetchTasks = async () => {
    const res = await API.get('/');
    setTasks(res.data);
  };

  // Add a task
  const addTask = async () => {
    if (title.trim()) {
      const res = await API.post('/', { title });
      setTasks([...tasks, res.data]);
      setTitle('');
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    await API.delete(`/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  // Toggle complete
  const toggleTask = async (id, currentStatus) => {
    const res = await API.put(`/${id}`, { completed: !currentStatus });
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Task Mate</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a task"
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 ml-2">Add</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="flex justify-between items-center border-b py-2">
            <span
              onClick={() => toggleTask(task._id, task.completed)}
              className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)} className="text-red-500">🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
