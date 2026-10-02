import { getDb } from "../../config/database";
import { User } from "./user.model";
import { Collection, ObjectId } from "mongodb";

export class UserRepository {

    private collection(): Collection<User> {
        return getDb().collection<User>("user");
    }

    async create(data: Omit<User, "_id">): Promise<User> {
        const result = await this.collection().insertOne(data as User);
        return { _id: result.insertedId, ...data };
    }

    async findAll(): Promise<User[]> {
        return this.collection().find().sort({ createdAt: -1 }).toArray();
    }

    async findById(id: ObjectId): Promise<User | null> {
        return this.collection().findOne({ _id: id });
    }

    async update(id: ObjectId, changes: Partial<User>): Promise<User | null> {
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
