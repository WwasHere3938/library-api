import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";
import { Genre, GenreDTO } from "./genre.model";
import { GenreRepository } from "./genre.repository";

export class GenreService {

    private readonly genreRepository = new GenreRepository();

    async create(data: GenreDTO): Promise<Genre> {
        const name = this.requireString(data?.name, "name");
        const description = this.requireString(data?.description, "description");

        const now = new Date();
        return this.genreRepository.create({
            name,
            description,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Genre[]> {
        return this.genreRepository.findAll();
    }

    async findById(id: string): Promise<Genre> {
        const genre = await this.genreRepository.findById(this.toObjectId(id));
        if (!genre) {
            throw new NotFoundError("Género no encontrado");
        }
        return genre;
    }



    async delete(id: string): Promise<Genre> {
        const objectId = this.toObjectId(id);
        const updated = await this.genreRepository.update(objectId, {
            updatedAt: new Date(),
        });
        if (!updated) {
            throw new NotFoundError("Género no encontrado");
        }
        return updated;
    }

    private requireString(value: unknown, field: string): string {
        if (typeof value !== "string" || value.trim() === "") {
            throw new BadRequestError(`El campo '${field}' es obligatorio y debe ser un texto no vacío`);
        }
        return value.trim();
    }

    private toObjectId(id: string): ObjectId {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError(`Identificador inválido: ${id}`);
        }
        return new ObjectId(id);
    }
}
