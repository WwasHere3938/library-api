import { ObjectId } from "mongodb";
import { Task, TaskDTO } from "./task.model";
import { TaskRepository } from "./task.repository";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";

export class TaskService {

    private readonly taskRepository = new TaskRepository();

    async create(data: TaskDTO): Promise<Task> {
        const title = this.requireString(data?.title, "title");
        const description = this.requireString(data?.description, "description");

        const now = new Date();
        return this.taskRepository.create({
            title,
            description,
            isDone: typeof data.isDone === "boolean" ? data.isDone : false,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Task[]> {
        return this.taskRepository.findAll();
    }

    async findById(id: string): Promise<Task> {
        const task = await this.taskRepository.findById(this.toObjectId(id));
        if (!task) {
            throw new NotFoundError("Tarea no encontrada");
        }
        return task;
    }

    async update(id: string, data: TaskDTO): Promise<Task> {
        const objectId = this.toObjectId(id);
        const changes: Partial<Task> = {};

        if (data.title !== undefined) changes.title = this.requireString(data.title, "title");
        if (data.description !== undefined) changes.description = this.requireString(data.description, "description");
        if (data.isDone !== undefined) {
            if (typeof data.isDone !== "boolean") {
                throw new BadRequestError("El campo 'isDone' debe ser booleano");
            }
            changes.isDone = data.isDone;
        }

        if (Object.keys(changes).length === 0) {
            throw new BadRequestError("No se enviaron campos para actualizar");
        }
        changes.updatedAt = new Date();

        const updated = await this.taskRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Tarea no encontrada");
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.taskRepository.delete(this.toObjectId(id));
        if (!deleted) {
            throw new NotFoundError("Tarea no encontrada");
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
