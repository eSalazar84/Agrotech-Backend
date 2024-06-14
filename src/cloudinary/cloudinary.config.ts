import { v2 as cloudinary }  from 'cloudinary';
import { CLOUDINARY_cloud_name, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from 'config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    console.log('Cloudinary Config:', {
      cloud_name: CLOUDINARY_cloud_name,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    return cloudinary.config({
      cloud_name: CLOUDINARY_cloud_name,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  },
};