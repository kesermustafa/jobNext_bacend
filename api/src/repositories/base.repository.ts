
import mongoose, {Model, QueryFilter, Document, UpdateQuery, QueryOptions, Query, PopulateOptions} from "mongoose";
import {AppError} from "../errors/AppError.js";

interface FindOptions {
    select?: string | string[] | Record<string, number | boolean>;
    populate?: string | PopulateOptions | (string | PopulateOptions)[];
}

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

    async findById(id: string | mongoose.Types.ObjectId, options: FindOptions = {}): Promise<T> {
        // 1. ID'yi temizle ve doğrula
        const cleanId = id.toString().trim();

        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            throw new AppError("Geçersiz ID formatı", 400);
        }

        // 2. Sorguyu başlat
        let query: Query<any, any> = this.model.findById(cleanId);

        // 3. Seçenekleri uygula
        if (options.select) {
            query = query.select(options.select);
        }

        if (options.populate) {
            query = query.populate(options.populate as any);
        }

        // 4. Veriyi getir
        const doc = await query;

        // 5. Veri yoksa hata fırlat (Senin throwIfNull metodun varsa onu kullan)
        if (!doc) {
            throw new AppError("Kayıt bulunamadı.", 404);
        }

        return doc as unknown as T;
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