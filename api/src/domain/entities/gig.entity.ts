export interface Gig {
    id?: string;
    user: string;

    title: string;
    description: string;

    reviewCount: number;
    starCount: number;

    category: string;

    coverImage: string;
    images: string[];

    packageTitle: string;
    packageDescription: string;
    packagePrice: number;
    packageFeatures: string[];
    packageDuration: number;
    packageRevisions: number;

    createdAt?: Date;
    updatedAt?: Date;
}