"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

const statusLabel = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Fetch tasks failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (!ignore && response.ok) {
          setTasks(data);
        }
      } catch (error) {
        console.error("Fetch tasks failed:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  const createTask = async () => {
    if (!title.trim()) return;

    try {
      setCreating(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setTitle("");
        await fetchTasks();
      }
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      await fetchTasks();
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Task Board</p>
            <h1 className="text-3xl font-bold text-slate-950">
              Your Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create tasks and update their progress.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold">{totalTasks}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold">{completedTasks}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row">
          <input
            type="text"
            placeholder="Enter task title"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={createTask}
            disabled={creating}
            className="rounded-lg bg-slate-950 px-6 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Adding..." : "Add Task"}
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold">No tasks yet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add your first task to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-semibold text-slate-950">
                    {task.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Current status: {statusLabel[task.status]}
                  </p>
                </div>

                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-950"
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}