import sharp from "sharp";

export const preprocessImage = async (imageBuffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(imageBuffer)
      .grayscale()             // Remove color info
      .resize(1600, null, {    // Upscale width to improve text resolution (if too small)
        fit: "inside",
        withoutEnlargement: false,
      })
      .sharpen()               // Sharpen to highlight edges
      .threshold(180)          // Binarize image: improves OCR accuracy
      .normalize()             // Normalize color/brightness
      .toBuffer();
  } catch (error) {
    console.error("Error preprocessing image:", error);
    return imageBuffer;
  }
};
