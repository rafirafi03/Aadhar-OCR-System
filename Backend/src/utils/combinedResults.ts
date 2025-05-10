import { ExtractedData } from "./extractData";

export const combineResults = (
  frontData: ExtractedData,
  backData: ExtractedData
) => {
  return {
    combinedText: `${frontData.text}\n${backData.text}`,
    averageConfidence: (frontData.confidence + backData.confidence) / 2,
    extractedFields: {
      ...backData.recognizedFields, // back usually has address
      ...frontData.recognizedFields,
    },
  };
};