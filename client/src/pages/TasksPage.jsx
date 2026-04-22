import { useEffect, useState } from "react";

import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import api from "../services/api.js";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionState, setActionState] = useState({
    taskId: "",
    type: ""
  });

  const loadTasks = async ({ showPageLoader = false } = {}) => {
    try {
      if (showPageLoader) {
        setLoading(true);
      }
      setError("");
      const response = await api.get("/tasks");
      setTasks(response.data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load tasks");
    } finally {
      if (showPageLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadTasks({ showPageLoader: true });
  }, []);

  const handleCreateTask = async (values) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");
      await api.post("/tasks", values);
      setShowCreateForm(false);
      setMessage("Task created successfully");
      await loadTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create task");
      throw requestError;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskId, values) => {
    try {
      setError("");
      setMessage("");
      await api.put(`/tasks/${taskId}`, values);
      setMessage("Task updated successfully");
      await loadTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update task");
      throw requestError;
    }
  };

  const handleStartTimer = async (taskId) => {
    try {
      setActionState({
        taskId,
        type: "start"
      });
      setError("");
      setMessage("");
      const response = await api.post(`/tasks/${taskId}/start`);
      setTasks((currentTasks) =>
        currentTasks.map((task) => ({
          ...task,
          isTimerRunning: task._id === taskId,
          activeTimerStartedAt:
            task._id === taskId ? response.data.timeLog?.startTime || new Date().toISOString() : null,
          status:
            task._id === taskId && task.status === "Pending" ? "In Progress" : task.status
        }))
      );
      setMessage(response.data.message);
      void loadTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to start timer");
    } finally {
      setActionState({
        taskId: "",
        type: ""
      });
    }
  };

  const handleStopTimer = async (taskId) => {
    try {
      setActionState({
        taskId,
        type: "stop"
      });
      setError("");
      setMessage("");
      const response = await api.post(`/tasks/${taskId}/stop`);
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task._id !== taskId) {
            return task;
          }

          return {
            ...task,
            isTimerRunning: false,
            activeTimerStartedAt: null,
            totalTrackedSeconds:
              task.totalTrackedSeconds + (response.data.timeLog?.duration || 0)
          };
        })
      );
      setMessage(response.data.message);
      void loadTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to stop timer");
    } finally {
      setActionState({
        taskId: "",
        type: ""
      });
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setActionState({
        taskId,
        type: "complete"
      });
      setError("");
      setMessage("");
      const response = await api.post(`/tasks/${taskId}/complete`);
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task._id !== taskId) {
            return task;
          }

          return {
            ...task,
            isTimerRunning: false,
            activeTimerStartedAt: null,
            status: "Completed",
            totalTrackedSeconds:
              task.totalTrackedSeconds + (response.data.timeLog?.duration || 0)
          };
        })
      );
      setMessage(response.data.message);
      void loadTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete task");
    } finally {
      setActionState({
        taskId: "",
        type: ""
      });
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    const shouldDelete = window.confirm(
      `Delete "${taskTitle}"? This will also remove its tracked time logs.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setActionState({
        taskId,
        type: "delete"
      });
      setError("");
      setMessage("");
      const response = await api.delete(`/tasks/${taskId}`);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
      setMessage(response.data.message || "Task deleted successfully");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete task");
    } finally {
      setActionState({
        taskId: "",
        type: ""
      });
    }
  };

  const activeTimerExists = tasks.some((task) => task.isTimerRunning);

  return (
    <div className="tasks-page">
      <div className="tasks-page__header">
        <h1 className="tasks-page__title">Task Management</h1>

        <button
          type="button"
          className="tasks-page__toggle-button button button--primary"
          onClick={() => setShowCreateForm((currentValue) => !currentValue)}
        >
          <span className="tasks-page__toggle-icon">+</span>
          {showCreateForm ? "Close Form" : "New Task"}
        </button>
      </div>

      {message && (
        <div className="message-banner message-banner--success">
          {message}
        </div>
      )}

      {error && (
        <div className="message-banner message-banner--error">
          {error}
        </div>
      )}

      {showCreateForm && (
        <section className="tasks-page__create-panel content-panel">
          <h2 className="tasks-page__section-title">Create New Task</h2>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
            submitText="Save Task"
            isSubmitting={submitting}
          />
        </section>
      )}

      {loading ? (
        <p className="page-loading-text">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <section className="tasks-page__empty-state content-panel">
          No tasks found. Create one to get started!
        </section>
      ) : (
        <section className="tasks-page__list">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onStartTimer={handleStartTimer}
              onStopTimer={handleStopTimer}
              onCompleteTask={handleCompleteTask}
              onDelete={handleDeleteTask}
              activeAction={actionState.taskId === task._id ? actionState.type : ""}
              activeTimerExists={activeTimerExists}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default TasksPage;
