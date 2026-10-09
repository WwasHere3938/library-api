import { ObjectId } from "mongodb";

export interface Genre {
    _id?: ObjectId;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos que el cliente puede enviar sobre una categoría.
*/
export interface GenreDTO {
    name?: string;
    description?: string;
    isActive?: boolean;
}

