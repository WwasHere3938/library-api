import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";
import { Author, AuthorDTO } from "./author.model";
import { authorRepository } from "./author.repository";
import { bookRepository } from "../books/book.repository";

function assertValidId(id: string): void {
  if (!ObjectId.isValid(id)) throw new BadRequestError("El id no es válido");
}

function assertNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError(`El campo '${field}' es obligatorio y no puede estar vacío`);
  }
  return value.trim();
}

function assertBirthYear(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new BadRequestError("El campo 'birthYear' debe ser un entero positivo");
  }
  return value;
}

export const authorService = {
  async create(dto: AuthorDTO): Promise<Author> {
    const now = new Date();
    const author: Omit<Author, "_id"> = {
      name: assertNonEmptyString(dto.name, "name"),
      nationality: assertNonEmptyString(dto.nationality, "nationality"),
      createdAt: now,
      updatedAt: now,
    };
    if (dto.birthYear !== undefined) author.birthYear = assertBirthYear(dto.birthYear);
    return authorRepository.create(author);
  },

  getAll(): Promise<Author[]> {
    return authorRepository.findAll();
  },

  async getById(id: string): Promise<Author> {
    assertValidId(id);
    const author = await authorRepository.findById(id);
    if (!author) throw new NotFoundError("Autor no encontrado");
    return author;
  },

  async update(id: string, dto: AuthorDTO): Promise<Author> {
    await this.getById(id); // valida id y existencia

    const changes: Partial<Author> = { updatedAt: new Date() };
    if (dto.name !== undefined) changes.name = assertNonEmptyString(dto.name, "name");
    if (dto.nationality !== undefined)
      changes.nationality = assertNonEmptyString(dto.nationality, "nationality");
    if (dto.birthYear !== undefined) changes.birthYear = assertBirthYear(dto.birthYear);

    const updated = await authorRepository.update(id, changes);
    return updated as Author;
  },

   async remove(id: string): Promise<void> {
    await this.getById(id);
    const books = await bookRepository.countByAuthorId(id);
    if (books > 0) {
      throw new BadRequestError("No se puede eliminar un autor que tiene libros asociados");
    }
    await authorRepository.delete(id);
  },
};