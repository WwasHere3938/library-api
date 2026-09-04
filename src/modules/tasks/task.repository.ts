import { getDb } from "../../config/database";
import { Task } from "./task.model";
import { Collection, ObjectId } from "mongodb";

export class TaskRepository {

    private collection(): Collection<Task> {
        return getDb().collection<Task>("task");
    }

    async create(data: Omit<Task, "_id">): Promise<Task> {
        const result = await this.collection().insertOne(data as Task);
        return { _id: result.insertedId, ...data };
    }

    async findAll(): Promise<Task[]> {
        return this.collection().find().sort({ createdAt: -1 }).toArray();
    }

    async findById(id: ObjectId): Promise<Task | null> {
        return this.collection().findOne({ _id: id });
    }

    async update(id: ObjectId, changes: Partial<Task>): Promise<Task | null> {
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
