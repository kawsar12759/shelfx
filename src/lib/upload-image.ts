import cloudinary from "./cloudinary";
import { MAX_COVER_BYTES } from "./limits";

interface UploadResult {
    secure_url: string;
    [key: string]: unknown;
}

/** Returns an error message if the file is not an acceptable cover image. */
export function validateCover(file: File): string | null {
    if (!file.type.startsWith("image/")) return "Cover must be an image file";
    if (file.size > MAX_COVER_BYTES) return "Cover image must be 5MB or smaller";
    return null;
}

export const UploadImage = async (file: File, folder: string): Promise<UploadResult> => {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    resource_type: "image",
                    folder: folder,
                },

                async (error, result) => {
                    if (error) {
                        return reject(error.message);
                    }

                    return resolve(result as UploadResult);
                }
            )

            .end(bytes);
    });
};
