import { Router } from "express";
import { TaskController } from "./task.controller";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
const taskController = new TaskController();

router.post("/", asyncHandler(taskController.create));
router.get("/", asyncHandler(taskController.findAll));
router.get("/:id", asyncHandler(taskController.findById));
router.put("/:id", asyncHandler(taskController.update));
router.delete("/:id", asyncHandler(taskController.delete));

export default router;
