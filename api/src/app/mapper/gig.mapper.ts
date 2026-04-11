import {Gig} from "@/domain/entities/gig.entity.js";
import {BaseMapper} from "@/app/mapper/base.mapper.js";

export class GigMapper extends BaseMapper<Gig, any> {

    toPersistence(domain: Gig): any {
        return {
            user: domain.user,
            title: domain.title,
            description: domain.description,
            reviewCount: domain.reviewCount,
            starCount: domain.starCount,
            category: domain.category,
            coverImage: domain.coverImage,
            images: domain.images,
            packageTitle: domain.packageTitle,        // ← snake_case kaldırıldı
            packageDescription: domain.packageDescription,
            packagePrice: domain.packagePrice,
            packageFeatures: domain.packageFeatures,
            packageDuration: domain.packageDuration,
            packageRevisions: domain.packageRevisions,
        };
    }

    toDomain(doc: any): Gig {
        return {
            id: doc._id?.toString(),
            user: doc.user?.toString(),
            title: doc.title,
            description: doc.description,
            reviewCount: doc.reviewCount,
            starCount: doc.starCount,
            category: doc.category,
            coverImage: doc.coverImage,
            images: doc.images,
            packageTitle: doc.packageTitle,           // ← snake_case kaldırıldı
            packageDescription: doc.packageDescription,
            packagePrice: doc.packagePrice,
            packageFeatures: doc.packageFeatures,
            packageDuration: doc.packageDuration,
            packageRevisions: doc.packageRevisions,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }


}