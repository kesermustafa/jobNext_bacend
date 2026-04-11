import {z} from "zod";

export const CreateGigSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(15).max(500),
    category: z.string(),
    packageTitle: z.string(),
    packageDescription: z.string(),
    packagePrice: z.coerce.number().min(1),        // "500" → 500
    packageFeatures: z.union([                      // "tek değer" veya ["array"]
        z.string().transform(v => [v]),
        z.array(z.string()),
    ]),
    packageDuration: z.coerce.number(),            // "3" → 3
    packageRevisions: z.coerce.number(),           // "2" → 2
});

export type CreateGigSchemaDTO = z.infer<typeof CreateGigSchema>;

// Controller'ın mapper'a göndereceği tam DTO
export interface CreateGigDTO extends CreateGigSchemaDTO {
    user: string;
    coverImage: string;
    images: string[];
}