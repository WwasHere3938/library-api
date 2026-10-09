import { getDb } from "../../config/database";
//import { Category, Genre } from "./genre.model";
import { Collection, ObjectId } from "mongodb";
import { Genre } from "./genre.model";

export class GenreRepository {

    private collection(): Collection<Genre> {
        return getDb().collection<Genre>("genre");
    }

    async create(data: Omit<Genre, "_id">): Promise<Genre> {
        const result = await this.collection().insertOne(data as Genre);
        return { _id: result.insertedId, ...data };
    }

    async findAll(): Promise<Genre[]> {
        return this.collection().find().sort({ createdAt: -1 }).toArray();
    }

    async findById(id: ObjectId): Promise<Genre | null> {
        return this.collection().findOne({ _id: id });
    }

    async update(id: ObjectId, changes: Partial<Genre>): Promise<Genre | null> {
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
