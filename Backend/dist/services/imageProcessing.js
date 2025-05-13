"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImages = void 0;
const extractData_1 = require("../utils/extractData");
const combinedResults_1 = require("../utils/combinedResults");
const analyzeImages = async (frontImageBuffer, backImageBuffer) => {
    try {
        const [frontData, backData] = await Promise.all([
            (0, extractData_1.extractData)(frontImageBuffer),
            (0, extractData_1.extractData)(backImageBuffer),
        ]);
        return (0, combinedResults_1.combineResults)(frontData, backData);
    }
    catch (error) {
        console.error("Error analyzing images:", error);
        throw error; // Let controller handle it
    }
};
exports.analyzeImages = analyzeImages;
