import { Router } from "express";
import taskRoutes from "../../modules/tasks/task.routes";

const router = Router();

router.use('/task', taskRoutes);

export default router;