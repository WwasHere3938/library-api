import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos que el cliente puede enviar sobre un usuario.
 * Todos los campos son opcionales; el servicio se encargará de validar que se envíen los campos requeridos.
 */
export interface UserDTO {
    name?: string;
    email?: string;
}
