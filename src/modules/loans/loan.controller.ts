import { Request, Response } from "express";
import { loanService } from "./loan.service";

export const loanController = {
  async create(req: Request, res: Response) {
    res.status(201).json(await loanService.create(req.body));
  },

  async getAll(_req: Request, res: Response) {
    res.status(200).json(await loanService.getAll());
  },

  async getById(req: Request, res: Response) {
    res.status(200).json(await loanService.getById(req.params.id as string));
  },

  async update(req: Request, res: Response) {
    res.status(200).json(await loanService.update(req.params.id as string, req.body));
  },

  async remove(req: Request, res: Response) {
    await loanService.remove(req.params.id as string);
    res.status(204).send();
  },
};