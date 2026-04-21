import { useEffect, useState } from "react";

import { formatDateTime, formatDuration } from "../utils/format.js";
import TaskForm from "./TaskForm.jsx";

const badgeStyles = {
  Pending: "task-card__badge task-card__badge--status-pending",
  "In Progress": "task-card__badge task-card__badge--status-in-progress",
  Completed: "task-card__badge task-card__badge--status-completed",
  Low: "task-card__badge task-card__badge--priority-low",
  Medium: "task-card__badge task-card__badge--priority-medium",
  High: "task-card__badge task-card__badge--priority-high"
};

const TaskCard = ({
  task,
  onUpdate,
  onStartTimer,
  onStopTimer,
  onCompleteTask,
  activeAction = "",
  activeTimerExists = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [liveNow, setLiveNow] = useState(Date.now());

  const handleUpdate = async (values) => {
    setIsSaving(true);

    try {
      await onUpdate(task._id, values);
      setIsEditing(false);
    } catch (error) {
      // The parent page already shows the error message.
    } finally {
      setIsSaving(false);
    }
  };

  const canStartTimer = !task.isTimerRunning && task.status !== "Completed";
  const isBlockedByOtherTimer = activeTimerExists && !task.isTimerRunning;
  const isStarting = activeAction === "start";
  const isStopping = activeAction === "stop";
  const isCompleting = activeAction === "complete";
  const isActionLoading = Boolean(activeAction);
  const activeTimerStartMs = task.activeTimerStartedAt
    ? new Date(task.activeTimerStartedAt).getTime()
    : null;
  const liveElapsedSeconds =
    task.isTimerRunning && activeTimerStartMs
      ? Math.max(0, Math.floor((liveNow - activeTimerStartMs) / 1000))
      : 0;
  const displayedTrackedSeconds = task.totalTrackedSeconds + liveElapsedSeconds;

  useEffect(() => {
    if (!task.isTimerRunning || !activeTimerStartMs) {
      return undefined;
    }

    setLiveNow(Date.now());

    const intervalId = window.setInterval(() => {
      setLiveNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [task.isTimerRunning, activeTimerStartMs]);

  return (
    <div className="task-card content-panel">
      {isEditing ? (
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status
          }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          submitText="Update Task"
          showStatus
          isSubmitting={isSaving}
        />
      ) : (
        <div className="task-card__content">
          <div className="task-card__header">
            <div>
              <div className="task-card__title-row">
                <h3 className="task-card__title">{task.title}</h3>
                <span className={badgeStyles[task.status]}>{task.status}</span>
                <span className={badgeStyles[task.priority]}>{task.priority}</span>
              </div>
              <p className="task-card__description">{task.description}</p>
            </div>

            <button
              type="button"
              className="button button--secondary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>

          <div className="task-card__details">
            <div className="task-card__detail">
              <p className="task-card__detail-label">Created</p>
              <p className="task-card__detail-value">{formatDateTime(task.createdAt)}</p>
            </div>
            <div className="task-card__detail">
              <p className="task-card__detail-label">Tracked Time</p>
              <p className="task-card__detail-value">
                {formatDuration(displayedTrackedSeconds)}
              </p>
            </div>
            <div className="task-card__detail">
              <p className="task-card__detail-label">Timer Status</p>
              <p className="task-card__detail-value">
                {task.isTimerRunning ? "Running" : "Stopped"}
              </p>
            </div>
          </div>

          <div className="task-card__actions">
            <button
              type="button"
              className="button button--primary"
              onClick={() => onStartTimer(task._id)}
              disabled={!canStartTimer || isBlockedByOtherTimer || isActionLoading}
            >
              {isStarting ? "Starting..." : "Start Timer"}
            </button>

            <button
              type="button"
              className="button button--secondary"
              onClick={() => onStopTimer(task._id)}
              disabled={!task.isTimerRunning || isActionLoading}
            >
              {isStopping ? "Stopping..." : "Stop Timer"}
            </button>

            {task.isTimerRunning && (
              <button
                type="button"
                className="button button--success"
                onClick={() => onCompleteTask(task._id)}
                disabled={isActionLoading}
              >
                {isCompleting ? "Completing..." : "Complete"}
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default TaskCard;
