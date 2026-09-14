import { v2 as cloudinary } from "cloudinary"

// Accept both the documented CLOUDINARY_* names and the legacy short names.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ?? process.env.API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ?? process.env.API_SECRET,
});

export default cloudinary;
