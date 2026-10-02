import { Router } from "express";
import { UserController } from "./user.controller";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
const userController = new UserController();

router.post("/", asyncHandler(userController.create));
router.get("/", asyncHandler(userController.findAll));
router.get("/:id", asyncHandler(userController.findById));
router.put("/:id", asyncHandler(userController.update));
router.delete("/:id", asyncHandler(userController.delete));

export default router;
