export interface CreateGigDTO {
    user: string;

    title: string;
    description: string;

    category: string;

    coverImage: string;
    images: string[];

    packageTitle: string;
    packageDescription: string;
    packagePrice: number;
    packageFeatures: string[];
    packageDuration: number;
    packageRevisions: number;
}