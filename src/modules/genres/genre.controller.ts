import { Request, Response } from "express";
import { GenreService } from "./genre.service";

export class GenreController {

    private readonly genreService = new GenreService();

    create = async (req: Request, res: Response): Promise<void> => {
        const genre = await this.genreService.create(req.body);
        res.status(201).json(genre);
    };

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const genres = await this.genreService.findAll();
        res.status(200).json(genres);
    };

    findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const genre = await this.genreService.findById(req.params.id);
        res.status(200).json(genre);
    };

    
    delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const genre = await this.genreService.delete(req.params.id);
        res.status(200).json(genre);
    };
}
