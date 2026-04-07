
import {Model, QueryFilter, Document, UpdateQuery, QueryOptions, Query} from "mongoose";


export abstract class BaseRepository<T extends Document> {
    protected model: Model<T>;
    protected entityName: string;

    constructor(model: Model<T>, entityName: string) {
        this.model = model;
        this.entityName = entityName;
    }

    protected throwIfNull(doc: T | null): T {
        if (!doc) throw new Error(this.entityName);
        return doc;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findOne(filter: QueryFilter<T>, options: QueryOptions = {}): Promise<T | null> {
        // Query tipini açıkça belirtiyoruz: Query<DönenTip | null, AnaTip>
        let query: Query<T | null, T> = this.model.findOne(filter);

        if (options.select) {
            // 'any' cast işlemi yaparak Mongoose'un katı tip kontrolünü esnetiyoruz
            query = query.select(options.select as any);
        }

        if (options.populate) {
            query = query.populate(options.populate as any);
        }

        return await query.exec(); // .exec() kullanmak her zaman daha güvenlidir
    }

    async findById(id: string, options: QueryOptions = {}): Promise<T> {
        const doc = await this.model.findById(id, null, options);
        return this.throwIfNull(doc);
    }

    async findAll(filter: QueryFilter<T> = {}, options: QueryOptions = {}): Promise<T[]> {
        let query: Query<T[], T> = this.model.find(filter);

        if (options.select) query = query.select(options.select as any);
        if (options.populate) query = query.populate(options.populate as any);
        if (options.sort) query = query.sort(options.sort as any);

        return await query.exec();
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T> {
        const doc = await this.model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        return this.throwIfNull(doc);
    }

    async delete(id: string): Promise<T> {
        const doc = await this.model.findByIdAndDelete(id);
        return this.throwIfNull(doc);
    }
}