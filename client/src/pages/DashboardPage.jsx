import { useEffect, useState } from "react";

import DonutChart from "../components/DonutChart.jsx";
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
    statusDistribution: {
      Pending: 0,
      "In Progress": 0,
      Completed: 0
    },
    priorityDistribution: {
      Low: 0,
      Medium: 0,
      High: 0
    },
    productivityAnalytics: {
      completionRate: 0,
      averageCompletedTaskSeconds: 0,
      highPriorityPendingTasks: 0,
      pendingTasks: 0,
      mostTrackedTask: null
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveNow, setLiveNow] = useState(Date.now());

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

  useEffect(() => {
    const hasRunningTimer = dashboard.activeTasks.some(
      (task) => task.isTimerRunning && task.activeTimerStartedAt
    );

    if (!hasRunningTimer) {
      return undefined;
    }

    setLiveNow(Date.now());

    const intervalId = window.setInterval(() => {
      setLiveNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dashboard.activeTasks]);

  if (loading) {
    return <p className="page-loading-text">Loading dashboard...</p>;
  }

  const getLiveElapsedSeconds = (task) => {
    if (!task.isTimerRunning || !task.activeTimerStartedAt) {
      return 0;
    }

    return Math.max(0, Math.floor((liveNow - new Date(task.activeTimerStartedAt).getTime()) / 1000));
  };

  const statusChartData = [
    {
      label: "Pending",
      value: dashboard.statusDistribution.Pending,
      color: "#94a3b8"
    },
    {
      label: "In Progress",
      value: dashboard.statusDistribution["In Progress"],
      color: "#f59e0b"
    },
    {
      label: "Completed",
      value: dashboard.statusDistribution.Completed,
      color: "#10b981"
    }
  ];

  const priorityChartData = [
    {
      label: "Low",
      value: dashboard.priorityDistribution.Low,
      color: "#38bdf8"
    },
    {
      label: "Medium",
      value: dashboard.priorityDistribution.Medium,
      color: "#8b5cf6"
    },
    {
      label: "High",
      value: dashboard.priorityDistribution.High,
      color: "#f43f5e"
    }
  ];

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
                      <p>
                        Tracked: {formatDuration(task.totalTrackedSeconds + getLiveElapsedSeconds(task))}
                      </p>
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
          <h2 className="dashboard-page__section-title">Productivity Analytics</h2>
        </div>

        <div className="dashboard-page__section-body--table">
          <div className="dashboard-page__charts-grid">
            <DonutChart
              title="Task Status Distribution"
              data={statusChartData}
            />
            <DonutChart
              title="Task Priority Distribution"
              data={priorityChartData}
            />
          </div>

          <div className="dashboard-page__analytics-grid">
            <div className="dashboard-page__analytics-card">
              <p className="dashboard-page__analytics-label">Completion Rate</p>
              <p className="dashboard-page__analytics-value">
                {dashboard.productivityAnalytics.completionRate}%
              </p>
              <p className="dashboard-page__analytics-helper">
                {dashboard.completedTasks} of {dashboard.totalTasks} tasks completed
              </p>
            </div>

            <div className="dashboard-page__analytics-card">
              <p className="dashboard-page__analytics-label">Average Completed Task Time</p>
              <p className="dashboard-page__analytics-value">
                {formatDuration(dashboard.productivityAnalytics.averageCompletedTaskSeconds)}
              </p>
              <p className="dashboard-page__analytics-helper">
                Average tracked time for completed tasks
              </p>
            </div>

            <div className="dashboard-page__analytics-card">
              <p className="dashboard-page__analytics-label">High Priority Pending</p>
              <p className="dashboard-page__analytics-value">
                {dashboard.productivityAnalytics.highPriorityPendingTasks}
              </p>
              <p className="dashboard-page__analytics-helper">
                {dashboard.productivityAnalytics.pendingTasks} pending tasks in total
              </p>
            </div>

            <div className="dashboard-page__analytics-card">
              <p className="dashboard-page__analytics-label">Most Time Spent Task</p>
              <p className="dashboard-page__analytics-value dashboard-page__analytics-value--text">
                {dashboard.productivityAnalytics.mostTrackedTask?.title || "No data yet"}
              </p>
              <p className="dashboard-page__analytics-helper">
                {dashboard.productivityAnalytics.mostTrackedTask
                  ? formatDuration(
                      dashboard.productivityAnalytics.mostTrackedTask.totalTrackedSeconds
                    )
                  : "Start a timer on a task to see this"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
