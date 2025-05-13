"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineResults = void 0;
const combineResults = (frontData, backData) => {
    return {
        combinedText: `${frontData.text}\n${backData.text}`,
        averageConfidence: (frontData.confidence + backData.confidence) / 2,
        extractedFields: {
            ...backData.recognizedFields, // back usually has address
            ...frontData.recognizedFields,
        },
    };
};
exports.combineResults = combineResults;
