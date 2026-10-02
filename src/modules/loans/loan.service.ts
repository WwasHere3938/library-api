import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";
import { bookRepository } from "../books/book.repository";
import { Loan, LoanDTO } from "./loan.model";
import { loanRepository } from "./loan.repository";

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

function assertBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new BadRequestError(`El campo '${field}' debe ser booleano`);
  }
  return value;
}

function assertDate(value: unknown, field: string): Date {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError(`El campo '${field}' debe ser una fecha válida (ej: 2026-10-01)`);
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new BadRequestError(`El campo '${field}' debe ser una fecha válida (ej: 2026-10-01)`);
  }
  return date;
}

export const loanService = {
  async create(dto: LoanDTO): Promise<Loan> {
    if (typeof dto.bookId !== "string" || !OBJECT_ID_REGEX.test(dto.bookId)) {
      throw new BadRequestError("El campo 'bookId' es obligatorio y debe ser un id válido");
    }
    const userName = assertNonEmptyString(dto.userName, "userName");
    const loanDate = assertDate(dto.loanDate, "loanDate");

    // Reglas de relación y de negocio
    const book = await bookRepository.findById(dto.bookId);
    if (!book) throw new BadRequestError("El libro indicado en 'bookId' no existe");
    if (!book.available) throw new BadRequestError("El libro no está disponible para préstamo");

    const now = new Date();
    const loan = await loanRepository.create({
      bookId: new ObjectId(dto.bookId),
      userName,
      loanDate,
      returned: false, // siempre inicia sin devolver
      createdAt: now,
      updatedAt: now,
    });

    await bookRepository.update(dto.bookId, { available: false, updatedAt: now });
    return loan;
  },

  getAll(): Promise<Loan[]> {
    return loanRepository.findAll();
  },

  async getById(id: string): Promise<Loan> {
    assertValidId(id);
    const loan = await loanRepository.findById(id);
    if (!loan) throw new NotFoundError("Préstamo no encontrado");
    return loan;
  },

  async update(id: string, dto: LoanDTO): Promise<Loan> {
    const loan = await this.getById(id);

    if (dto.bookId !== undefined) {
      throw new BadRequestError("No se puede cambiar el libro de un préstamo");
    }

    const changes: Partial<Loan> = { updatedAt: new Date() };
    let markReturned = false;

    if (dto.userName !== undefined) changes.userName = assertNonEmptyString(dto.userName, "userName");
    if (dto.loanDate !== undefined) changes.loanDate = assertDate(dto.loanDate, "loanDate");
    if (dto.returnDate !== undefined) changes.returnDate = assertDate(dto.returnDate, "returnDate");

    if (dto.returned !== undefined) {
      const returned = assertBoolean(dto.returned, "returned");
      if (!returned && loan.returned) {
        throw new BadRequestError("Un préstamo devuelto no se puede reabrir");
      }
      if (returned && !loan.returned) {
        markReturned = true;
        changes.returned = true;
        changes.returnDate = changes.returnDate ?? new Date(); // regla: asignar returnDate
      }
    }

    if (changes.returnDate && !loan.returned && !markReturned) {
      throw new BadRequestError("'returnDate' solo se asigna al marcar el préstamo como devuelto");
    }
    const finalLoanDate = changes.loanDate ?? loan.loanDate;
    if (changes.returnDate && changes.returnDate < finalLoanDate) {
      throw new BadRequestError("'returnDate' no puede ser anterior a 'loanDate'");
    }

    const updated = (await loanRepository.update(id, changes)) as Loan;

    // Regla de negocio: al devolver, el libro vuelve a estar disponible
    if (markReturned) {
      await bookRepository.update(loan.bookId.toString(), {
        available: true,
        updatedAt: new Date(),
      });
    }
    return updated;
  },

  async remove(id: string): Promise<void> {
    const loan = await this.getById(id);
    await loanRepository.delete(id);

    // Si se borra un préstamo activo, el libro no debe quedar bloqueado
    if (!loan.returned) {
      await bookRepository.update(loan.bookId.toString(), {
        available: true,
        updatedAt: new Date(),
      });
    }
  },
};