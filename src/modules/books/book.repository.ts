import { ObjectId } from "mongodb";
import { getDb } from "../../config/database";
import { Book } from "./book.model";

const collection = () => getDb().collection<Book>("books");

export const bookRepository = {
  // Índice único de isbn: se llama una vez al arrancar el servidor
  async ensureIndexes(): Promise<void> {
    await collection().createIndex({ isbn: 1 }, { unique: true });
  },

  async create(data: Omit<Book, "_id">): Promise<Book> {
    const result = await collection().insertOne(data as Book);
    return { ...data, _id: result.insertedId };
  },

  findAll(): Promise<Book[]> {
    return collection().find().toArray();
  },

  findById(id: string): Promise<Book | null> {
    return collection().findOne({ _id: new ObjectId(id) });
  },

  findByIsbn(isbn: string): Promise<Book | null> {
    return collection().findOne({ isbn });
  },

  countByAuthorId(authorId: string): Promise<number> {
    return collection().countDocuments({ authorId: new ObjectId(authorId) });
  },

  async update(id: string, data: Partial<Book>): Promise<Book | null> {
    await collection().updateOne({ _id: new ObjectId(id) }, { $set: data });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};