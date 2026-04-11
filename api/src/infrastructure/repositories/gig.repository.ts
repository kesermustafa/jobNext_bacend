import {BaseRepository} from "@/infrastructure/repositories/base.repository.js";
import {Gig} from "@/domain/entities/gig.entity.js";
import {GigMapper} from "@/app/mapper/gig.mapper.js";
import {GigModel} from "@/infrastructure/database/models/gig.model.js";

export class GigRepository extends BaseRepository<Gig> {

    constructor(
        private readonly mapper: GigMapper
    ) {
        super(GigModel, "Gig");
    }

    async create(gig: Gig): Promise<Gig> {
        const persistence = this.mapper.toPersistence(gig);
        const doc = await this.model.create(persistence);
        return this.mapper.toDomain(doc.toObject());
    }

    async findByTitle(title: string, userId: string): Promise<Gig | null> {
        const doc = await this.model.findOne({title, user: userId});
        if (!doc) return null;
        return this.mapper.toDomain(doc.toObject());
    }
}