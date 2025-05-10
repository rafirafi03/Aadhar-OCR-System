import sharp from "sharp";

export const preprocessImage = async (imageBuffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();
  } catch (error) {
    console.error("Error preprocessing image:", error);
    return imageBuffer;
  }
};