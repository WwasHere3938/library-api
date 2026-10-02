import { Request, Response } from "express";
import { authorService } from "./author.service";

export const authorController = {
  async create(req: Request, res: Response) {
    const author = await authorService.create(req.body);
    res.status(201).json(author);
  },

  async getAll(_req: Request, res: Response) {
    res.status(200).json(await authorService.getAll());
  },

  async getById(req: Request, res: Response) {
    res.status(200).json(await authorService.getById(req.params.id as string));
  },

  async update(req: Request, res: Response) {
    res.status(200).json(await authorService.update(req.params.id as string, req.body));
  },

  async remove(req: Request, res: Response) {
    await authorService.remove(req.params.id as string);
    res.status(204).send();
  },
};