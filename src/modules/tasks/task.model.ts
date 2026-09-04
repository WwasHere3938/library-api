import { ObjectId } from "mongodb";

export interface Task {
    _id?: ObjectId;
    title: string;
    description: string;
    isDone: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/** Datos que el cliente envía para crear una tarea. */
export interface CreateTaskDTO {
    title: string;
    description: string;
    isDone?: boolean;
}

/** Datos que el cliente puede enviar para actualizar una tarea (parciales). */
export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    isDone?: boolean;
}
