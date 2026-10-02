import { ObjectId } from "mongodb";

export interface Category {
    _id?: ObjectId;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos que el cliente puede enviar sobre una categoría.
*/
export interface CategoryDTO {
    name?: string;
    description?: string;
    isActive?: boolean;
}

