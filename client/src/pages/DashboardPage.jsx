import { useEffect, useState } from "react";

import api from "../services/api.js";
import { formatDuration } from "../utils/format.js";
import StatCard from "../components/StatCard.jsx";

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalTrackedSeconds: 0,
    activeTasks: [],
    timeByTask: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/dashboard");
        setDashboard(response.data);
        setError("");
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="page-loading-text">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">My Workspace</h1>
      </div>

      {error && (
        <div className="message-banner message-banner--error">
          {error}
        </div>
      )}

      <div className="dashboard-page__stats-grid">
        <StatCard title="Total Tasks" value={dashboard.totalTasks} icon="tasks" tone="brand" />
        <StatCard
          title="Completed"
          value={dashboard.completedTasks}
          icon="completed"
          tone="green"
        />
        <StatCard
          title="In Progress"
          value={dashboard.inProgressTasks}
          icon="progress"
          tone="amber"
        />
        <StatCard
          title="Total Time Tracked"
          value={formatDuration(dashboard.totalTrackedSeconds)}
          icon="time"
          tone="purple"
        />
      </div>

      <section className="dashboard-page__section content-panel">
        <div className="dashboard-page__section-header">
          <h2 className="dashboard-page__section-title">Current Work</h2>
        </div>

        <div className="dashboard-page__section-body">
          <h3 className="dashboard-page__subheading">Active Tasks</h3>

          {dashboard.activeTasks.length === 0 ? (
            <div className="dashboard-page__empty-state">
              No active tasks. Create one from the Tasks page to get started.
            </div>
          ) : (
            <div className="dashboard-page__active-list">
              {dashboard.activeTasks.map((task) => (
                <div key={task._id} className="dashboard-page__active-card">
                  <div className="dashboard-page__active-row">
                    <div>
                      <p className="dashboard-page__active-task-title">{task.title}</p>
                      <p className="dashboard-page__active-task-description">{task.description}</p>
                    </div>
                    <div className="dashboard-page__active-meta">
                      <p>Status: {task.status}</p>
                      <p>Tracked: {formatDuration(task.totalTrackedSeconds)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-page__section content-panel">
        <div className="dashboard-page__section-header">
          <h2 className="dashboard-page__section-title">Time Spent Per Task</h2>
        </div>

        <div className="dashboard-page__section-body--table">
          {dashboard.timeByTask.length === 0 ? (
            <div className="dashboard-page__empty-state">
              No time logs recorded yet. Start a timer on a task to track time.
            </div>
          ) : (
            <div className="dashboard-page__table-wrap">
              <div className="dashboard-page__table-head">
                <p>Task</p>
                <p>Status</p>
                <p>Tracked Time</p>
              </div>

              {dashboard.timeByTask.map((task) => (
                <div key={task.taskId} className="dashboard-page__table-row">
                  <p>{task.title}</p>
                  <p>{task.status}</p>
                  <p>{formatDuration(task.totalTrackedSeconds)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
