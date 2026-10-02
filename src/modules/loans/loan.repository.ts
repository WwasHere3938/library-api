import { ObjectId } from "mongodb";
import { getDb } from "../../config/database";
import { Loan } from "./loan.model";

const collection = () => getDb().collection<Loan>("loans");

export const loanRepository = {
  async create(data: Omit<Loan, "_id">): Promise<Loan> {
    const result = await collection().insertOne(data as Loan);
    return { ...data, _id: result.insertedId };
  },

  findAll(): Promise<Loan[]> {
    return collection().find().toArray();
  },

  findById(id: string): Promise<Loan | null> {
    return collection().findOne({ _id: new ObjectId(id) });
  },

  countActiveByBookId(bookId: string): Promise<number> {
    return collection().countDocuments({ bookId: new ObjectId(bookId), returned: false });
  },

  async update(id: string, data: Partial<Loan>): Promise<Loan | null> {
    await collection().updateOne({ _id: new ObjectId(id) }, { $set: data });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};