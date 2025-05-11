import Tesseract from "tesseract.js";
import { AadhaarFields } from "../types/AadharFields";
import { parseFields } from "./parseFields";

export interface ExtractedData {
  text: string;
  confidence: number;
  recognizedFields?: AadhaarFields;
}

export const extractData = async (
  imageBuffer: Buffer
): Promise<ExtractedData> => {
  try {
    const processedBuffer = imageBuffer;

    const result = await Tesseract.recognize(processedBuffer, "eng", {
      logger: (m) => console.log(m),
    });

    console.log("result : ", result)

    return {
      text: result.data.text,
      confidence: result.data.confidence,
      recognizedFields: parseFields(result.data.text),
    };
  } catch (error) {
    console.error("Error extracting data from image:", error);
    throw new Error(
      `Image processing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};