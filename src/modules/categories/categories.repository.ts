import { getDb } from "../../config/database";
import { Category } from "./categories.model";
import { Collection, ObjectId } from "mongodb";

export class CategoryRepository {

    private collection(): Collection<Category> {
        return getDb().collection<Category>("category");
    }

    async create(data: Omit<Category, "_id">): Promise<Category> {
        const result = await this.collection().insertOne(data as Category);
        return { _id: result.insertedId, ...data };
    }

    async findAll(): Promise<Category[]> {
        return this.collection().find().sort({ createdAt: -1 }).toArray();
    }

    async findById(id: ObjectId): Promise<Category | null> {
        return this.collection().findOne({ _id: id });
    }

    async update(id: ObjectId, changes: Partial<Category>): Promise<Category | null> {
        const result = await this.collection().findOneAndUpdate(
            { _id: id },
            { $set: changes },
            { returnDocument: "after" }
        );
        return result ?? null;
    }

    async delete(id: ObjectId): Promise<boolean> {
        const result = await this.collection().deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}
