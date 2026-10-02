import { ObjectId } from "mongodb";

export interface Book {
  _id?: ObjectId;
  title: string;
  isbn: string;
  authorId: ObjectId;
  year?: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// authorId llega como string en el JSON y el servicio lo convierte a ObjectId
export interface BookDTO {
  title?: string;
  isbn?: string;
  authorId?: string;
  year?: number;
  available?: boolean;
}