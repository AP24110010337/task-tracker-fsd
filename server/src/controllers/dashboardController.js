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
    let totalTrackedSeconds = 0;

    timeLogs.forEach((timeLog) => {
      const taskId = String(timeLog.taskId);

      totalTrackedSeconds += timeLog.duration || 0;
      totalByTask[taskId] = (totalByTask[taskId] || 0) + (timeLog.duration || 0);
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
        isTimerRunning: activeTaskIds.has(String(task._id))
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

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      totalTrackedSeconds,
      activeTasks,
      timeByTask
    });
  } catch (error) {
    next(error);
  }
};
