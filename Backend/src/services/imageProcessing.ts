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

    console.log("frontData in service:", frontData);
    console.log("backData in service:", backData);

    return combineResults(frontData, backData);
  } catch (error) {
    console.error("Error analyzing images:", error);
    throw new Error(
      `Combined image analysis failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
