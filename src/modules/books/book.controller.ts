import { Request, Response } from "express";
import { bookService } from "./book.service";

export const bookController = {
  async create(req: Request, res: Response) {
    res.status(201).json(await bookService.create(req.body));
  },

  async getAll(_req: Request, res: Response) {
    res.status(200).json(await bookService.getAll());
  },

  async getById(req: Request, res: Response) {
    res.status(200).json(await bookService.getById(req.params.id as string));
  },

  async update(req: Request, res: Response) {
    res.status(200).json(await bookService.update(req.params.id as string, req.body));
  },

  async remove(req: Request, res: Response) {
    await bookService.remove(req.params.id as string);
    res.status(204).send();
  },
};