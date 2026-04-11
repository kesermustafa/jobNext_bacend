export interface GigResponseDTO {
    id: string;
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
    reviewCount: number;
    starCount: number;
}