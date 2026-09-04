import { Request, Response } from "express";
import { TaskService } from "./task.service";

export class TaskController {

    private readonly taskService = new TaskService();

    create = async (req: Request, res: Response): Promise<void> => {
        const task = await this.taskService.create(req.body);
        res.status(201).json(task);
    };

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const tasks = await this.taskService.findAll();
        res.status(200).json(tasks);
    };

    findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const task = await this.taskService.findById(req.params.id);
        res.status(200).json(task);
    };

    update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const task = await this.taskService.update(req.params.id, req.body);
        res.status(200).json(task);
    };

    delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        await this.taskService.delete(req.params.id);
        res.status(204).send();
    };
}
