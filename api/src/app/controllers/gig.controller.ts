import {Request, Response} from "express";
import {CreateGigSchema} from "@/app/validators/gig/gig.schema.js";
import {CreateGigUseCase} from "@/app/use-case/gigService/createGig.usecase.js";
import {GigDtoMapper} from "@/app/mapper/gig.dto.mapper.js";
import {ForbiddenError} from "@/shared/errors/SpecificErrors.js";
import ValidationError = module
import module from "node:module";


export class GigController {
    constructor(
        private createGigUseCase: CreateGigUseCase,
        private gigDtoMapper: GigDtoMapper
    ) {
    }

    create = async (req: Request, res: Response) => {

        // iş kuralı — seller kontrolü
        if (!req.user?.isSeller) {
            throw new ForbiddenError("Only sellers can create gigs");
        }


        // Body validate
        const validated = CreateGigSchema.parse(req.body);

        // 1. Dosya parse
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const coverFile = files?.coverImage?.[0];
        const imageFiles = files?.images;

        if (!coverFile) throw new ValidationError("coverImage is required");
        if (!imageFiles?.length) throw new ValidationError("At least one image is required");

        // 2. DTO → Domain (kısmi)
        const gigData = this.gigDtoMapper.toDomain({
            ...validated,
            user: req.user!.id,
        });

        // 3. Use case
        const result = await this.createGigUseCase.execute({
            gig: gigData,
            coverFile: {buffer: coverFile.buffer, mimetype: coverFile.mimetype},
            imageFiles: imageFiles.map(f => ({buffer: f.buffer, mimetype: f.mimetype})),
            isSeller: req.user!.isSeller,
        });

        res.status(201).json(this.gigDtoMapper.toDTO(result));
    };
}