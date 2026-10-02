import { ObjectId } from "mongodb";
import { User, UserDTO } from "./user.model";
import { UserRepository } from "./user.repository";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";

export class UserService {

    private readonly userRepository = new UserRepository();

    async create(data: UserDTO): Promise<User> {
        const name = this.requireString(data?.name, "name");
        const email = this.requireString(data?.email, "email");

        const now = new Date();
        return this.userRepository.create({
            name,
            email,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findById(this.toObjectId(id));
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }
        return user;
    }

    async update(id: string, data: UserDTO): Promise<User> {
        const objectId = this.toObjectId(id);
        const changes: Partial<User> = {};

        if (data.name !== undefined) changes.name = this.requireString(data.name, "name");
        if (data.email !== undefined) changes.email = this.requireString(data.email, "email");

        if (Object.keys(changes).length === 0) {
            throw new BadRequestError("No se enviaron campos para actualizar");
        }
        changes.updatedAt = new Date();

        const updated = await this.userRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Usuario no encontrado");
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.userRepository.delete(this.toObjectId(id));
        if (!deleted) {
            throw new NotFoundError("Usuario no encontrado");
        }
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
