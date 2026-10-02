import { Router } from "express";
//import { TaskController } from "./task.controller";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { CategoryController } from "./categories.controller";

const router = Router();
const categoryController = new CategoryController();

router.post("/", asyncHandler(categoryController.create));
router.get("/", asyncHandler(categoryController.findAll));
router.get("/:id", asyncHandler(categoryController.findById));
router.put("/:id", asyncHandler(categoryController.update));
router.delete("/:id", asyncHandler(categoryController.delete));

export default router;
