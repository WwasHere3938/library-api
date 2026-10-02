import { Router } from "express";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { bookController } from "./book.controller";

const router = Router();

router.post("/", asyncHandler(bookController.create));
router.get("/", asyncHandler(bookController.getAll));
router.get("/:id", asyncHandler(bookController.getById));
router.put("/:id", asyncHandler(bookController.update));
router.delete("/:id", asyncHandler(bookController.remove));

export default router;