import { Router } from "express";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { loanController } from "./loan.controller";

const router = Router();

router.post("/", asyncHandler(loanController.create));
router.get("/", asyncHandler(loanController.getAll));
router.get("/:id", asyncHandler(loanController.getById));
router.put("/:id", asyncHandler(loanController.update));
router.delete("/:id", asyncHandler(loanController.remove));

export default router;