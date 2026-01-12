import { useEffect, useState } from "react";

export default function Calendar() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("optima_tasks")) || [];
    setTasks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("optima_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { text: task, done: false }]);
    setTask("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  return (
    <div className="calendar-page">
      <h1>🗓 Calendar & Tasks</h1>
      <p className="muted">
        Plan your schedule and manage daily tasks.
      </p>

      {/* Calendar */}
      <div className="calendar-embed">
        <iframe
          title="Google Calendar"
          src="https://calendar.google.com/calendar/embed?src=en.ke%23holiday%40group.v.calendar.google.com"
        ></iframe>
      </div>

      {/* Tasks */}
      <div className="tasks-section">
        <h2>✔ Tasks</h2>

      
        <div className="tasks-input">
          <input
            type="text"
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="btn primary" onClick={addTask}>
            Add
          </button>
        </div>

        <ul className="tasks-list">
          {tasks.map((t, i) => (
            <li
              key={i}
              className={t.done ? "done" : ""}
              onClick={() => toggleTask(i)}
            >
              {t.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

