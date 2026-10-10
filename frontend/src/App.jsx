import { useState } from "react";
import "./App.css";

function App() {
const [page, setPage] = useState("Dashboard");
const [tasks, setTasks] = useState([]);
const [taskName, setTaskName] = useState("");
const [notes, setNotes] = useState([]);
const [noteTitle, setNoteTitle] = useState("");
const [noteContent, setNoteContent] = useState("");

const pages = ["Dashboard", "Tasks", "Study Notes", "Progress"];

const completed = tasks.filter((task) => task.done).length;
const pending = tasks.length - completed;

function addTask(event) {
event.preventDefault();


if (taskName.trim() === "") {
  return;
}

const newTask = {
  id: Date.now(),
  title: taskName.trim(),
  done: false,
};

setTasks([...tasks, newTask]);
setTaskName("");


}

function toggleTask(id) {
setTasks(
tasks.map((task) =>
task.id === id ? { ...task, done: !task.done } : task
)
);
}

function deleteTask(id) {
setTasks(tasks.filter((task) => task.id !== id));
}

function addNote(event) {
event.preventDefault();

if (noteTitle.trim() === "" || noteContent.trim() === "") {
return;
}

const newNote = {
id: Date.now(),
title: noteTitle.trim(),
content: noteContent.trim(),
};

setNotes([...notes, newNote]);
setNoteTitle("");
setNoteContent("");
}

function deleteNote(id) {
setNotes(notes.filter((note) => note.id !== id));
}


return ( <div className="app"> <aside className="sidebar"> <h2 className="logo">Dayora.</h2> <p className="subtitle">YOUR PERSONAL PRODUCTIVITY HUB</p>


    <nav>
      {pages.map((item) => (
        <button
          key={item}
          className={page === item ? "active" : ""}
          onClick={() => setPage(item)}
        >
          {item}
        </button>
      ))}
    </nav>

    <div className="sidebar-note">
      <p>Small steps.</p>
      <p>Steady growth. 🌱</p>
    </div>
  </aside>

  <main className="content">
    <header className="welcome">
      <p className="eyebrow">YOUR SPACE TO GROW</p>
      <h1>{page === "Dashboard" ? "Welcome to Dayora!" : page}</h1>
      <p>Make today count. One task, one note, one step at a time.</p>
    </header>

    {page === "Dashboard" && (
      <section>
        <h2>Your study overview</h2>
        <p className="description">
          A little progress each day adds up to big results.
        </p>

        <div className="cards">
          <div className="card">
            <span>Total Tasks</span>
            <h3>{tasks.length}</h3>
            <p>All your study tasks</p>
          </div>

          <div className="card">
            <span>Completed</span>
            <h3>{completed}</h3>
            <p>Tasks you've finished</p>
          </div>

          <div className="card">
            <span>Pending</span>
            <h3>{pending}</h3>
            <p>Still to be done</p>
          </div>
        </div>

        <div className="focus-card">
          <h2>Today's reminder 🌿</h2>
          <p>You don't need to do everything today. Just begin.</p>
        </div>
      </section>
    )}

    {page === "Tasks" && (
      <section className="panel">
        <h2>My Tasks</h2>
        <p>Add your assignments and daily goals below.</p>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="e.g. Study Java for 30 minutes"
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        {tasks.length === 0 ? (
          <p className="empty-message">
            No tasks yet. Add your first task to get started!
          </p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className="task-item" key={task.id}>
                <label className={task.done ? "task-done" : ""}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  {task.title}
                </label>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    )}

   {page === "Study Notes" && (

  <section className="panel">
    <h2>My Study Notes</h2>
    <p>Save the important things you learn, all in one place.</p>


<form className="note-form" onSubmit={addNote}>
  <input
    type="text"
    placeholder="Note title (e.g. Java OOP)"
    value={noteTitle}
    onChange={(event) => setNoteTitle(event.target.value)}
  />

  <textarea
    placeholder="Write your study notes here..."
    value={noteContent}
    onChange={(event) => setNoteContent(event.target.value)}
    rows="4"
  />

  <button type="submit">Save Note</button>
</form>

<div className="notes-grid">
  {notes.length === 0 ? (
    <p className="empty-message">
      No notes yet. Save your first study note!
    </p>
  ) : (
    notes.map((note) => (
      <div className="note-card" key={note.id}>
        <h3>{note.title}</h3>
        <p>{note.content}</p>
        <button
          className="delete-button"
          type="button"
          onClick={() => deleteNote(note.id)}
        >
          Delete
        </button>
      </div>
    ))
  )}
</div>


  </section>
)}


    {page === "Progress" && (
      <section className="panel">
        <h2>My Progress</h2>
        <p>Total tasks: {tasks.length}</p>
        <p>Completed tasks: {completed}</p>
        <p>Pending tasks: {pending}</p>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width:
                tasks.length === 0
                  ? "0%"
                  : `${(completed / tasks.length) * 100}%`,
            }}
          />
        </div>

        <p>
          Completion:{" "}
          {tasks.length === 0
            ? 0
            : Math.round((completed / tasks.length) * 100)}
          %
        </p>
      </section>
    )}
  </main>
</div>


);
}

export default App;
