import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {

    private readonly userService = new UserService();

    create = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.create(req.body);
        res.status(201).json(user);
    };

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const users = await this.userService.findAll();
        res.status(200).json(users);
    };

    findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const user = await this.userService.findById(req.params.id);
        res.status(200).json(user);
    };

    update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const user = await this.userService.update(req.params.id, req.body);
        res.status(200).json(user);
    };

    delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        await this.userService.delete(req.params.id);
        res.status(204).send();
    };
}
