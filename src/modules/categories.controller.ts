import { Request, Response } from "express";
//import { TaskService } from "./task.service";
import { CategoryService } from "./categories.service";

export class CategoryController {

    private readonly categoryService = new CategoryService();

    create = async (req: Request, res: Response): Promise<void> => {
        const category = await this.categoryService.create(req.body);
        res.status(201).json(category);
    };

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const categories = await this.categoryService.findAll();
        res.status(200).json(categories);
    };

    findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const category = await this.categoryService.findById(req.params.id);
        res.status(200).json(category);
    };

    update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const category = await this.categoryService.update(req.params.id, req.body);
        res.status(200).json(category);
    };

    //delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    //    await this.categoryService.delete(req.params.id);
    //    res.status(204).send();
    //};
    
    delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const category = await this.categoryService.delete(req.params.id);
        res.status(200).json(category);
    };
}
