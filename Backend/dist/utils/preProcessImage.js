"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const preprocessImage = async (imageBuffer) => {
    try {
        return await (0, sharp_1.default)(imageBuffer)
            .grayscale() // Remove color info
            .resize(1600, null, {
            fit: "inside",
            withoutEnlargement: false,
        })
            .sharpen() // Sharpen to highlight edges
            .threshold(180) // Binarize image: improves OCR accuracy
            .normalize() // Normalize color/brightness
            .toBuffer();
    }
    catch (error) {
        console.error("Error preprocessing image:", error);
        return imageBuffer;
    }
};
exports.preprocessImage = preprocessImage;
