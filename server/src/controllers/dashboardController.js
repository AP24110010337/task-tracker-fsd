import Task from "../models/Task.js";
import TimeLog from "../models/TimeLog.js";

export const getDashboardData = async (req, res, next) => {
  try {
    const [tasks, timeLogs] = await Promise.all([
      Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean(),
      TimeLog.find({ userId: req.user._id }).lean()
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const totalByTask = {};
    const activeStartTimeByTask = {};
    let totalTrackedSeconds = 0;

    timeLogs.forEach((timeLog) => {
      const taskId = String(timeLog.taskId);

      totalTrackedSeconds += timeLog.duration || 0;
      totalByTask[taskId] = (totalByTask[taskId] || 0) + (timeLog.duration || 0);

      if (!timeLog.endTime) {
        activeStartTimeByTask[taskId] = timeLog.startTime;
      }
    });

    const activeTaskIds = new Set(
      timeLogs
        .filter((timeLog) => !timeLog.endTime)
        .map((timeLog) => String(timeLog.taskId))
    );

    const activeTasks = tasks
      .filter(
        (task) => task.status !== "Completed" || activeTaskIds.has(String(task._id))
      )
      .map((task) => ({
        ...task,
        totalTrackedSeconds: totalByTask[String(task._id)] || 0,
        isTimerRunning: activeTaskIds.has(String(task._id)),
        activeTimerStartedAt: activeStartTimeByTask[String(task._id)] || null
      }));

    const timeByTask = tasks
      .map((task) => ({
        taskId: task._id,
        title: task.title,
        status: task.status,
        totalTrackedSeconds: totalByTask[String(task._id)] || 0
      }))
      .filter((task) => task.totalTrackedSeconds > 0)
      .sort((firstTask, secondTask) => {
        return secondTask.totalTrackedSeconds - firstTask.totalTrackedSeconds;
      });

    const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
    const highPriorityPendingTasks = tasks.filter(
      (task) => task.priority === "High" && task.status === "Pending"
    ).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const lowPriorityTasks = tasks.filter((task) => task.priority === "Low").length;
    const mediumPriorityTasks = tasks.filter((task) => task.priority === "Medium").length;
    const highPriorityTasks = tasks.filter((task) => task.priority === "High").length;

    const completedTaskIds = new Set(
      tasks
        .filter((task) => task.status === "Completed")
        .map((task) => String(task._id))
    );

    const totalCompletedTrackedSeconds = timeLogs.reduce((totalSeconds, timeLog) => {
      if (!completedTaskIds.has(String(timeLog.taskId))) {
        return totalSeconds;
      }

      return totalSeconds + (timeLog.duration || 0);
    }, 0);

    const averageCompletedTaskSeconds =
      completedTasks > 0 ? Math.floor(totalCompletedTrackedSeconds / completedTasks) : 0;

    const mostTrackedTask = timeByTask.length > 0 ? timeByTask[0] : null;

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      totalTrackedSeconds,
      activeTasks,
      statusDistribution: {
        Pending: pendingTasks,
        "In Progress": inProgressTasks,
        Completed: completedTasks
      },
      priorityDistribution: {
        Low: lowPriorityTasks,
        Medium: mediumPriorityTasks,
        High: highPriorityTasks
      },
      productivityAnalytics: {
        completionRate,
        averageCompletedTaskSeconds,
        highPriorityPendingTasks,
        pendingTasks,
        mostTrackedTask
      }
    });
  } catch (error) {
    next(error);
  }
};
