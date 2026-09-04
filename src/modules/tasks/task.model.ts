import { ObjectId } from "mongodb";

export interface Task {
    _id?: ObjectId;
    title: string;
    description: string;
    isDone: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos que el cliente puede enviar sobre una tarea.
 * Todos los campos son opcionales; el servicio valida qué es
 * obligatorio según la operación (crear vs. actualizar).
 */
export interface TaskDTO {
    title?: string;
    description?: string;
    isDone?: boolean;
}
