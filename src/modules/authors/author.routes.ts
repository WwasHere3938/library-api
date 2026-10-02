import { Router } from "express";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { authorController } from "./author.controller";

const router = Router();

router.post("/", asyncHandler(authorController.create));
router.get("/", asyncHandler(authorController.getAll));
router.get("/:id", asyncHandler(authorController.getById));
router.put("/:id", asyncHandler(authorController.update));
router.delete("/:id", asyncHandler(authorController.remove));

export default router;