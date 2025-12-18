import sharp from 'sharp';
import cloudinary from '../config/cloudinary';
import ApiError from '../utils/ApiError';

/**
 * Upload image to Cloudinary
 * @param buffer Image buffer
 * @param folder Folder name in Cloudinary
 * @returns Uploaded image URL
 */
export const uploadImage = async (
  buffer: Buffer,
  folder: string = 'challenges'
): Promise<string> => {
  try {
    // 1. Optimize image using Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();

    // 2. Upload to Cloudinary using stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(ApiError.internal('Image upload failed'));
          } else {
            if (!result) {
              reject(ApiError.internal('Image upload failed - no result'));
            } else {
              resolve(result.secure_url);
            }
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(optimizedBuffer);
    });
  } catch (error) {
    console.error('Image processing error:', error);
    throw ApiError.internal('Failed to process and upload image');
  }
};

/**
 * Delete image from Cloudinary
 * @param imageUrl Full image URL
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public ID from URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/imageId.jpg
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const imageId = filename.split('.')[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${imageId}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error here to avoid blocking main operation
  }
};
