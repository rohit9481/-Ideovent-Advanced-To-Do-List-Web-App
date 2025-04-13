import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showMotivation, setShowMotivation] = useState(false);  // State to control motivation pop-up visibility

  const motivationMessages = [
    "Keep pushing forward, you're doing great!",
    "Success is the sum of small efforts, repeated daily.",
    "Believe in yourself, you're unstoppable!",
    "The harder you work, the luckier you get.",
    "Don't stop until you're proud!",
    "Great things take time, keep going!",
    "Your only limit is your mind.",
    "Stay positive and work hard!"
  ];

  // Load all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  // Add task
  const addTask = async () => {
    if (title.trim() && description.trim() && dueDate.trim() && category.trim()) {
      try {
        const res = await axios.post('http://localhost:5000/api/tasks', { title, description, dueDate, category });
        setTasks([...tasks, res.data]);
        setTitle('');
        setDescription('');
        setDueDate('');
        setCategory('');
      } catch (err) {
        console.error("Error adding task:", err.message);
      }
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  // Toggle completion
  const toggleTask = async (id, completed) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
      
      // Show motivation pop-up after task completion
      if (!completed) {
        setShowMotivation(true);
      }
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  // Handle search
  const filteredTasks = tasks.filter((task) => {
    return (
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCategory ? task.category === filterCategory : true)
    );
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Close Motivation Pop-up
  const handleCloseMotivation = () => {
    setShowMotivation(false);
  };

  return (
    <div className="bg-animated">
      {/* Main container for the app */}
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">📝 Task Mate</h1>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border p-2 flex-1 mb-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter by Category */}
        <div className="mb-4">
          <select
            className="border p-2 w-full"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        {/* Add Task Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title"
            className="border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="border p-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            className="border p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
          </select>
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded col-span-2 sm:col-span-1">
            Add Task
          </button>
        </div>

        {/* Task List */}
        <ul>
          {filteredTasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id, task.completed)}
                />
                <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                <span className="text-sm text-gray-500">{task.description}</span>
                <span className="text-sm text-gray-400">{task.dueDate}</span>
                <span className="text-sm text-gray-500">{task.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => deleteTask(task._id)} className="text-red-500 text-xl">🗑</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Motivation Pop-up */}
      {showMotivation && (
        <div className="motivation-popup fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="motivation-popup-content bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl mb-4">🎉 Great Job!</h2>
            <p className="text-lg mb-4">You have completed a task!</p>
            <button onClick={handleCloseMotivation} className="bg-green-500 text-white px-6 py-2 rounded">Close</button>
          </div>
        </div>
      )}

      {/* Marquee for Motivational Quotes */}
      <div className="mt-6 bg-blue-500 text-white p-4 text-center">
        <marquee behavior="scroll" direction="left" className="font-semibold">
          {motivationMessages.join(' | ')}
        </marquee>
      </div>
    </div>
  );
}

export default App;
