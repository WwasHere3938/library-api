import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";
import { CategoryRepository } from "./categories.repository";
import { Category, CategoryDTO } from "./categories.model";

export class CategoryService {

    private readonly categoryRepository = new CategoryRepository();

    async create(data: CategoryDTO): Promise<Category> {
        const name = this.requireString(data?.name, "name");
        const description = this.requireString(data?.description, "description");

        const now = new Date();
        return this.categoryRepository.create({
            name,
            description,
            isActive: typeof data.isActive === "boolean" ? data.isActive : true,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.findAll();
    }

    async findById(id: string): Promise<Category> {
        const category = await this.categoryRepository.findById(this.toObjectId(id));
        if (!category) {
            throw new NotFoundError("Categoría no encontrada");
        }
        return category;
    }

    async update(id: string, data: CategoryDTO): Promise<Category> {
        const objectId = this.toObjectId(id);
        const changes: Partial<Category> = {};

        if (data.name !== undefined) changes.name = this.requireString(data.name, "name");
        if (data.description !== undefined) changes.description = this.requireString(data.description, "description");
        if (data.isActive !== undefined) {
            if (typeof data.isActive !== "boolean") {
                throw new BadRequestError("El campo 'isActive' debe ser booleano");
            }
            changes.isActive = data.isActive;
        }

        if (Object.keys(changes).length === 0) {
            throw new BadRequestError("No se enviaron campos para actualizar");
        }
        changes.updatedAt = new Date();

        const updated = await this.categoryRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Categoría no encontrada");
        }
        return updated;
    }

    async delete(id: string): Promise<Category> {
        const objectId = this.toObjectId(id);
        const updated = await this.categoryRepository.update(objectId, {
            isActive: false,
            updatedAt: new Date(),
        });
        if (!updated) {
            throw new NotFoundError("Categoría no encontrada");
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
