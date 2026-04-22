import express from "express";

import {
  completeTask,
  createTask,
  deleteTask,
  getTasks,
  startTaskTimer,
  stopTaskTimer,
  updateTask
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);
router.post("/:id/start", startTaskTimer);
router.post("/:id/stop", stopTaskTimer);
router.post("/:id/complete", completeTask);

export default router;
