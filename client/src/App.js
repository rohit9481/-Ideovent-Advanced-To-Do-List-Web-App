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
  const [showMotivation, setShowMotivation] = useState(false);

  const motivationMessages = [
    "🚀 Keep pushing forward, you're doing great!",
    "🎯 Success is the sum of small efforts, repeated daily.",
    "💪 Believe in yourself, you're unstoppable!",
    "🔥 The harder you work, the luckier you get.",
    "🏁 Don't stop until you're proud!",
    "🌱 Great things take time, keep going!",
    "🧠 Your only limit is your mind.",
    "💡 Stay positive and work hard!"
  ];

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  const addTask = async () => {
    if (title && description && dueDate && category) {
      try {
        const res = await axios.post('http://localhost:5000/api/tasks', {
          title,
          description,
          dueDate,
          category,
        });
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

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
      if (!completed) setShowMotivation(true);
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  const filteredTasks = tasks.filter(task =>
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!filterCategory || task.category === filterCategory)
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 p-4">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-white/20">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-xl">✨ Task Mate</h1>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 rounded-xl bg-white/80 placeholder-gray-600" />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 rounded-xl bg-white/80 placeholder-gray-600" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-3 rounded-xl bg-white/80" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 rounded-xl bg-white/80">
            <option value="">Select Category</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Shopping</option>
          </select>
        </div>

        <button onClick={addTask} className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 rounded-xl transition hover:scale-105">
          ➕ Add Task
        </button>

        {/* Filters */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Search by title or description" className="p-3 rounded-xl bg-white/80" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="p-3 rounded-xl bg-white/80">
            <option value="">All Categories</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Shopping</option>
          </select>
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`p-4 bg-white/20 backdrop-blur-md border-l-4 ${
                task.completed ? 'border-green-400' : 'border-yellow-300'
              } rounded-xl shadow-md flex justify-between items-center`}
            >
              <div className="flex flex-col w-full">
                {task.isEditing ? (
                  <>
                    <input
                      type="text"
                      value={task.editTitle || task.title}
                      onChange={(e) =>
                        setTasks((prev) =>
                          prev.map((t) =>
                            t._id === task._id ? { ...t, editTitle: e.target.value } : t
                          )
                        )
                      }
                      className="text-lg font-bold mb-1 p-2 rounded bg-white/80"
                    />
                    <input
                      type="text"
                      value={task.editDescription || task.description}
                      onChange={(e) =>
                        setTasks((prev) =>
                          prev.map((t) =>
                            t._id === task._id ? { ...t, editDescription: e.target.value } : t
                          )
                        )
                      }
                      className="text-sm text-gray-600 p-2 rounded bg-white/80"
                    />
                  </>
                ) : (
                  <>
                    <h3
                      className={`text-lg font-bold ${
                        task.completed ? 'line-through text-gray-300' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-200">{task.description}</p>
                    <p className="text-xs text-blue-200">
                      📅 {new Date(task.dueDate).toLocaleDateString()} | 🏷️ {task.category}
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id, task.completed)}
                  className="w-5 h-5"
                />

                {task.isEditing ? (
                  <button
                    onClick={async () => {
                      const updated = await axios.put(
                        `http://localhost:5000/api/tasks/${task._id}`,
                        {
                          title: task.editTitle || task.title,
                          description: task.editDescription || task.description,
                        }
                      );
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id ? { ...updated.data, isEditing: false } : t
                        )
                      );
                    }}
                    className="text-green-400 text-xl"
                  >
                    ✔
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id
                            ? {
                                ...t,
                                isEditing: true,
                                editTitle: t.title,
                                editDescription: t.description,
                              }
                            : t
                        )
                      )
                    }
                    className="text-yellow-400 hover:text-yellow-300 text-xl"
                  >
                    ✏
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-400 hover:text-red-600 text-xl"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🎉 Motivation Modal */}
        {showMotivation && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-sm animate-bounce">
              <h2 className="text-2xl font-bold mb-2 text-green-600">🎉 Great Job!</h2>
              <p className="text-gray-700 mb-4">{motivationMessages[Math.floor(Math.random() * motivationMessages.length)]}</p>
              <button onClick={() => setShowMotivation(false)} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">Close</button>
            </div>
          </div>
        )}

        {/* 💬 Marquee */}
        <div className="mt-8 bg-white/10 text-white text-center py-3 rounded-xl shadow-inner text-sm">
          <marquee behavior="scroll" direction="left">{motivationMessages.join(' ✨ ')}</marquee>
        </div>
      </div>
    </div>
  );
}

export default App;
