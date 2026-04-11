import mongoose, {Model, QueryFilter, Document, QueryOptions, Query, PopulateOptions} from "mongoose";
import {AppError} from "@/shared/errors/AppError.js";

interface FindOptions {
    select?: string | string[] | Record<string, number | boolean>;
    populate?: string | PopulateOptions | (string | PopulateOptions)[];
}

export abstract class BaseRepository<T> {
    protected model: Model<any>;
    protected entityName: string;

    constructor(model: Model<any>, entityName: string) {
        this.model = model;
        this.entityName = entityName;
    }

    protected throwIfNull(doc: any): T {
        if (!doc) throw new AppError(`${this.entityName} bulunamadı`, 404);
        return doc as T;
    }

    async findById(id: string | mongoose.Types.ObjectId, options: FindOptions = {}): Promise<T> {
        const cleanId = id.toString().trim();

        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            throw new AppError("Geçersiz ID formatı", 400);
        }

        let query = this.model.findById(cleanId);

        if (options.select) {
            query = query.select(options.select);
        }

        if (options.populate) {
            query = query.populate(options.populate as any);
        }

        const doc = await query.exec();
        return this.throwIfNull(doc);
    }


    async create(data: any): Promise<T> {
        const doc = await this.model.create(data);
        return doc as T;
    }

    async findOne(filter: QueryFilter<T>, options: QueryOptions = {}): Promise<T | null> {
        let query = this.model.findOne(filter);

        if (options.select) {
            query = query.select(options.select as any);
        }

        if (options.populate) {
            query = query.populate(options.populate as any);
        }

        const doc = await query.exec();
        return doc as T | null;
    }


    async findAll(filter: QueryFilter<T> = {}, options: QueryOptions = {}): Promise<T[]> {
        let query: Query<T[], T> = this.model.find(filter);

        if (options.select) query = query.select(options.select as any);
        if (options.populate) query = query.populate(options.populate as any);
        if (options.sort) query = query.sort(options.sort as any);

        return await query.exec();
    }

    async update(id: string, data: any): Promise<T> {
        const doc = await this.model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).exec();

        return this.throwIfNull(doc);
    }

    async delete(id: string): Promise<T> {
        const doc = await this.model.findByIdAndDelete(id).exec();
        return this.throwIfNull(doc);
    }
}
