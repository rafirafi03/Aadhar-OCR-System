"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImages = void 0;
const extractData_1 = require("../utils/extractData");
const combinedResults_1 = require("../utils/combinedResults");
const checkIfAadhaar_1 = require("../utils/checkIfAadhaar");
const analyzeImages = async (frontImageBuffer, backImageBuffer) => {
    try {
        const [frontData, backData] = await Promise.all([
            (0, extractData_1.extractData)(frontImageBuffer),
            (0, extractData_1.extractData)(backImageBuffer),
        ]);
        const isValidFront = (0, checkIfAadhaar_1.checkIfAadhaar)(frontData?.text);
        const isValidBack = (0, checkIfAadhaar_1.checkIfAadhaar)(backData?.text);
        if (!isValidFront || !isValidBack) {
            // Throw a 400-type error explicitly
            const err = new Error("Provided images are not valid Aadhaar card");
            err.statusCode = 400;
            throw err;
        }
        return (0, combinedResults_1.combineResults)(frontData, backData);
    }
    catch (error) {
        console.error("Error analyzing images:", error);
        throw error; // Let controller handle it
    }
};
exports.analyzeImages = analyzeImages;
