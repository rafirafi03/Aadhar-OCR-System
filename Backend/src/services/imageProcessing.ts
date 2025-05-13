import { extractData } from "../utils/extractData";
import { combineResults } from "../utils/combinedResults";
import { checkIfAadhaar } from "../utils/checkIfAadhaar";

export const analyzeImages = async (
  frontImageBuffer: Buffer,
  backImageBuffer: Buffer
): Promise<any> => {
  try {
    const [frontData, backData] = await Promise.all([
      extractData(frontImageBuffer),
      extractData(backImageBuffer),
    ]);

    const isValidFront = checkIfAadhaar(frontData?.text);
    const isValidBack = checkIfAadhaar(backData?.text);

    if (!isValidFront || !isValidBack) {
      // Throw a 400-type error explicitly
      const err = new Error("Provided images are not valid Aadhaar card");
      (err as any).statusCode = 400;
      throw err;
    }

    return combineResults(frontData, backData);
  } catch (error) {
    console.error("Error analyzing images:", error);
    throw error; // Let controller handle it
  }
};
