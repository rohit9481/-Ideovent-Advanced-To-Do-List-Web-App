import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tasks', formData);
    setFormData({ title: '', description: '', dueDate: '', category: '' });
    onTaskCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2" required />
      <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2" />
      <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="border p-2" />
      <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded">Add Task</button>
    </form>
  );
}

export default TaskForm;
