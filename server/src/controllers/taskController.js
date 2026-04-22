import Task from "../models/Task.js";
import TimeLog from "../models/TimeLog.js";

const stopActiveTimeLog = async (activeTimeLog) => {
  activeTimeLog.endTime = new Date();
  activeTimeLog.duration = Math.max(
    0,
    Math.floor((activeTimeLog.endTime - activeTimeLog.startTime) / 1000)
  );

  await activeTimeLog.save();

  return activeTimeLog;
};

const buildTaskResponse = (tasks, timeLogs) => {
  const durationByTask = {};
  const activeTaskIds = new Set();
  const activeStartTimeByTask = {};

  timeLogs.forEach((timeLog) => {
    const taskId = String(timeLog.taskId);

    durationByTask[taskId] = (durationByTask[taskId] || 0) + (timeLog.duration || 0);

    if (!timeLog.endTime) {
      activeTaskIds.add(taskId);
      activeStartTimeByTask[taskId] = timeLog.startTime;
    }
  });

  return tasks.map((task) => ({
    ...task,
    totalTrackedSeconds: durationByTask[String(task._id)] || 0,
    isTimerRunning: activeTaskIds.has(String(task._id)),
    activeTimerStartedAt: activeStartTimeByTask[String(task._id)] || null
  }));
};

export const getTasks = async (req, res, next) => {
  try {
    const [tasks, timeLogs] = await Promise.all([
      Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean(),
      TimeLog.find({ userId: req.user._id }).lean()
    ]);

    res.json(buildTaskResponse(tasks, timeLogs));
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status } = req.body;

    if (!title || !description || !priority) {
      res.status(400);
      throw new Error("Title, description, and priority are required");
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const { title, description, priority, status } = req.body;

    if (title !== undefined) {
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (status !== undefined) {
      task.status = status;
    }

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    await TimeLog.deleteMany({
      taskId: task._id,
      userId: req.user._id
    });
    await task.deleteOne();

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const startTaskTimer = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (task.status === "Completed") {
      res.status(400);
      throw new Error("Cannot start timer for a completed task");
    }

    const activeTimeLog = await TimeLog.findOne({
      userId: req.user._id,
      endTime: null
    });

    if (activeTimeLog && String(activeTimeLog.taskId) === String(task._id)) {
      res.status(400);
      throw new Error("Timer is already running for this task");
    }

    if (activeTimeLog) {
      res.status(400);
      throw new Error("Only one active timer is allowed at a time");
    }

    const timeLog = await TimeLog.create({
      taskId: task._id,
      userId: req.user._id,
      startTime: new Date()
    });

    if (task.status === "Pending") {
      task.status = "In Progress";
      await task.save();
    }

    res.status(201).json({
      message: "Timer started successfully",
      timeLog
    });
  } catch (error) {
    next(error);
  }
};

export const stopTaskTimer = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const activeTimeLog = await TimeLog.findOne({
      taskId: task._id,
      userId: req.user._id,
      endTime: null
    });

    if (!activeTimeLog) {
      res.status(400);
      throw new Error("No active timer found for this task");
    }

    await stopActiveTimeLog(activeTimeLog);

    res.json({
      message: "Timer stopped successfully",
      timeLog: activeTimeLog
    });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const activeTimeLog = await TimeLog.findOne({
      taskId: task._id,
      userId: req.user._id,
      endTime: null
    });

    if (activeTimeLog) {
      await stopActiveTimeLog(activeTimeLog);
    }

    task.status = "Completed";
    const updatedTask = await task.save();

    res.json({
      message: activeTimeLog
        ? "Task completed and timer stopped successfully"
        : "Task marked as completed successfully",
      task: updatedTask,
      timeLog: activeTimeLog
    });
  } catch (error) {
    next(error);
  }
};
