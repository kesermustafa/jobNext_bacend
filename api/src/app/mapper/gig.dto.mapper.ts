import {Gig} from "@/domain/entities/gig.entity.js";
import {CreateGigDTO} from "@/app/validators/gig/gig.schema.js";
import {GigResponseDTO} from "@/app/dtos/gigDTOs/GigResponseDTO.js";

// Controller'dan gelen kısmi veri
export interface CreateGigInput {
    user: string;
    title: string;
    description: string;
    category: string;
    packageTitle: string;
    packageDescription: string;
    packagePrice: number;
    packageFeatures: string[];
    packageDuration: number;
    packageRevisions: number;
}

export class GigDtoMapper {
    toDomain(dto: CreateGigInput): Omit<Gig, "coverImage" | "images" | "reviewCount" | "starCount"> {
        return {
            user: dto.user,
            title: dto.title,
            description: dto.description,
            category: dto.category,
            packageTitle: dto.packageTitle,
            packageDescription: dto.packageDescription,
            packagePrice: dto.packagePrice,
            packageFeatures: dto.packageFeatures,
            packageDuration: dto.packageDuration,
            packageRevisions: dto.packageRevisions,
        };
    }

    toDTO(gig: Gig): GigResponseDTO {
        return {
            id: gig.id!,
            user: gig.user,
            title: gig.title,
            description: gig.description,
            category: gig.category,
            coverImage: gig.coverImage,
            images: gig.images,
            packageTitle: gig.packageTitle,
            packageDescription: gig.packageDescription,
            packagePrice: gig.packagePrice,
            packageFeatures: gig.packageFeatures,
            packageDuration: gig.packageDuration,
            packageRevisions: gig.packageRevisions,
            reviewCount: gig.reviewCount,
            starCount: gig.starCount,
        };
    }
}