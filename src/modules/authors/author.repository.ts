import { ObjectId } from "mongodb";
import { getDb } from "../../config/database";
import { Author } from "./author.model";

const collection = () => getDb().collection<Author>("authors");

export const authorRepository = {
  async create(data: Omit<Author, "_id">): Promise<Author> {
    const result = await collection().insertOne(data as Author);
    return { ...data, _id: result.insertedId };
  },

  findAll(): Promise<Author[]> {
    return collection().find().toArray();
  },

  findById(id: string): Promise<Author | null> {
    return collection().findOne({ _id: new ObjectId(id) });
  },

  async update(id: string, data: Partial<Author>): Promise<Author | null> {
    await collection().updateOne({ _id: new ObjectId(id) }, { $set: data });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};