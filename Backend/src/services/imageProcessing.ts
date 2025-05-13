import { extractData } from "../utils/extractData";
import { combineResults } from "../utils/combinedResults";

export const analyzeImages = async (
  frontImageBuffer: Buffer,
  backImageBuffer: Buffer
): Promise<any> => {
  try {
    const [frontData, backData] = await Promise.all([
      extractData(frontImageBuffer),
      extractData(backImageBuffer),
    ]);

    return combineResults(frontData, backData);
  } catch (error) {
    console.error("Error analyzing images:", error);
    throw error; // Let controller handle it
  }
};
