import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";
import { authorRepository } from "../authors/author.repository";
import { Book, BookDTO } from "./book.model";
import { bookRepository } from "./book.repository";
import { loanRepository } from "../loans/loan.repository";

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

function assertValidId(id: string): void {
  if (!OBJECT_ID_REGEX.test(id)) throw new BadRequestError("El id no es válido");
}

function assertNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError(`El campo '${field}' es obligatorio y no puede estar vacío`);
  }
  return value.trim();
}

function assertYear(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new BadRequestError("El campo 'year' debe ser un número entero");
  }
  return value;
}

function assertBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new BadRequestError(`El campo '${field}' debe ser booleano`);
  }
  return value;
}

// Valida el formato del authorId y que el autor exista (regla de relación)
async function assertAuthorExists(authorId: unknown): Promise<ObjectId> {
  if (typeof authorId !== "string" || !OBJECT_ID_REGEX.test(authorId)) {
    throw new BadRequestError("El campo 'authorId' es obligatorio y debe ser un id válido");
  }
  const author = await authorRepository.findById(authorId);
  if (!author) throw new BadRequestError("El autor indicado en 'authorId' no existe");
  return new ObjectId(authorId);
}

async function assertIsbnAvailable(isbn: string, currentBookId?: string): Promise<void> {
  const existing = await bookRepository.findByIsbn(isbn);
  if (existing && existing._id!.toString() !== currentBookId) {
    throw new BadRequestError("Ya existe un libro con ese ISBN");
  }
}

export const bookService = {
  async create(dto: BookDTO): Promise<Book> {
    const title = assertNonEmptyString(dto.title, "title");
    const isbn = assertNonEmptyString(dto.isbn, "isbn");
    const authorId = await assertAuthorExists(dto.authorId);
    await assertIsbnAvailable(isbn);

    const now = new Date();
    const book: Omit<Book, "_id"> = {
      title,
      isbn,
      authorId,
      available: dto.available !== undefined ? assertBoolean(dto.available, "available") : true,
      createdAt: now,
      updatedAt: now,
    };
    if (dto.year !== undefined) book.year = assertYear(dto.year);

    return bookRepository.create(book);
  },

  getAll(): Promise<Book[]> {
    return bookRepository.findAll();
  },

  async getById(id: string): Promise<Book> {
    assertValidId(id);
    const book = await bookRepository.findById(id);
    if (!book) throw new NotFoundError("Libro no encontrado");
    return book;
  },

  async update(id: string, dto: BookDTO): Promise<Book> {
    await this.getById(id); // valida id y existencia

    const changes: Partial<Book> = { updatedAt: new Date() };
    if (dto.title !== undefined) changes.title = assertNonEmptyString(dto.title, "title");
    if (dto.isbn !== undefined) {
      const isbn = assertNonEmptyString(dto.isbn, "isbn");
      await assertIsbnAvailable(isbn, id);
      changes.isbn = isbn;
    }
    if (dto.authorId !== undefined) changes.authorId = await assertAuthorExists(dto.authorId);
    if (dto.year !== undefined) changes.year = assertYear(dto.year);
    if (dto.available !== undefined) changes.available = assertBoolean(dto.available, "available");

    return (await bookRepository.update(id, changes)) as Book;
  },

    async remove(id: string): Promise<void> {
    await this.getById(id);
    const activeLoans = await loanRepository.countActiveByBookId(id);
    if (activeLoans > 0) {
      throw new BadRequestError("No se puede eliminar un libro con un préstamo activo");
    }
    await bookRepository.delete(id);
  },
};