import {GigRepository} from "@/infrastructure/repositories/gig.repository.js";
import {Gig} from "@/domain/entities/gig.entity.js";
import {ConflictError, ForbiddenError} from "@/shared/errors/SpecificErrors.js";
import {uploadFromBuffer} from "@/shared/utils/cloudinary.js";


export interface CreateGigInput {
    gig: Omit<Gig, "coverImage" | "images" | "reviewCount" | "starCount">;
    coverFile: { buffer: Buffer; mimetype: string };   // ← mimetype eklendi
    imageFiles: { buffer: Buffer; mimetype: string }[];
    isSeller: boolean;
}


export class CreateGigUseCase {

    constructor(
        private gigRepository: GigRepository,
    ) {
    }


    async execute(input: CreateGigInput): Promise<Gig> {

        // title kontrolü
        const existing = await this.gigRepository.findByTitle(input.gig.title, input.gig.user);
        if (existing) {
            throw new ConflictError(`"${input.gig.title}" başlıklı bir gig zaten mevcut`);
        }

        const [coverUpload, ...imageUploads] = await Promise.all([
            uploadFromBuffer(input.coverFile.buffer, "gigs/covers", input.coverFile.mimetype),
            ...input.imageFiles.map(f =>
                uploadFromBuffer(f.buffer, "gigs/images", f.mimetype)
            ),
        ]);


        // domain nesnesi tamamla
        const gig: Gig = {
            ...input.gig,
            coverImage: coverUpload.secure_url,
            images: imageUploads.map(u => u.secure_url),
            reviewCount: 0,
            starCount: 0,
        };

        return this.gigRepository.create(gig);
    }


}