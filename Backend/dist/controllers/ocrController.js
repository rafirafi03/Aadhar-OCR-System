"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrController = void 0;
const imageProcessing_1 = require("../services/imageProcessing"); // Importing the function directly
// Use the function directly in the controller
const ocrController = async (req, res) => {
    try {
        const files = req.files;
        if (!files || !files.frontImage || !files.backImage) {
            res.status(400).json({
                success: false,
                message: "Both front and back image files are required",
            });
            return;
        }
        const frontImageBuffer = files.frontImage[0].buffer;
        const backImageBuffer = files.backImage[0].buffer;
        const combinedAnalysis = await (0, imageProcessing_1.analyzeImages)(frontImageBuffer, backImageBuffer);
        res.status(200).json({
            success: true,
            data: {
                combined: combinedAnalysis,
            },
        });
    }
    catch (error) {
        const statusCode = error?.statusCode || 500;
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(statusCode).json({
            success: false,
            message,
        });
    }
};
exports.ocrController = ocrController;
