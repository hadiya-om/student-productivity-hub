import { useState,useEffect } from "react";
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

useEffect(() => {
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");

      if (!response.ok) {
        throw new Error("Could not load tasks");
      }

      const data = await response.json();

      setTasks(
        data.map((task) => ({
          id: task._id,
          title: task.name,
          done: task.completed,
        }))
      );
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  fetchTasks();
}, []);


useEffect(() => {
  async function fetchNotes() {
    try {
      const response = await fetch("http://localhost:5000/api/notes");

      if (!response.ok) {
        throw new Error("Could not load notes");
      }

      const data = await response.json();

      setNotes(
        data.map((note) => ({
          id: note._id,
          title: note.title,
          content: note.content,
        }))
      );
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }

  fetchNotes();
}, []);

async function addTask(event) {
  event.preventDefault();

  if (taskName.trim() === "") {
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: taskName.trim() }),
    });

    if (!response.ok) {
      throw new Error("Could not save task");
    }

    const task = await response.json();

    setTasks((previousTasks) => [
      ...previousTasks,
      {
        id: task._id,
        title: task.name,
        done: task.completed,
      },
    ]);

    setTaskName("");
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Could not save task. Please check the backend.");
  }
}

async function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !task.done }),
      }
    );

    if (!response.ok) {
      throw new Error("Could not update task");
    }

    const updatedTask = await response.json();

    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === id
          ? { ...item, done: updatedTask.completed }
          : item
      )
    );
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Could not update task.");
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Could not delete task");
    }

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Could not delete task.");
  }
}

async function addNote(event) {
  event.preventDefault();

  if (noteTitle.trim() === "" || noteContent.trim() === "") {
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: noteTitle.trim(),
        content: noteContent.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error("Could not save note");
    }

    const note = await response.json();

    setNotes((previousNotes) => [
      {
        id: note._id,
        title: note.title,
        content: note.content,
      },
      ...previousNotes,
    ]);

    setNoteTitle("");
    setNoteContent("");
  } catch (error) {
    console.error("Error saving note:", error);
    alert("Could not save note. Please check the backend.");
  }
}


async function deleteNote(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/notes/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Could not delete note");
    }

    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== id)
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    alert("Could not delete note.");
  }
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
