import {v2 as cloudinary, UploadApiResponse} from "cloudinary";
import streamifier from "streamifier";

export const initCloudinary = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("❌ Cloudinary env missing!");
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
};

export const uploadFromBuffer = (buffer: Buffer, folder: string, mimetype: string): Promise<UploadApiResponse> => {
    const skipFormats = ["image/gif", "image/svg+xml"];
    const shouldConvert = !skipFormats.includes(mimetype);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                ...(shouldConvert && {
                    format: "webp",
                    quality: "auto",
                }),
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result as UploadApiResponse);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};