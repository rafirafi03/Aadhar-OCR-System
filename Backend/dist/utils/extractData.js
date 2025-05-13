"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractData = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const parseFields_1 = require("./parseFields");
const extractData = async (imageBuffer) => {
    try {
        const processedBuffer = imageBuffer;
        const result = await tesseract_js_1.default.recognize(processedBuffer, "eng", {
            logger: (m) => console.log(m),
        });
        console.log("result : ", result);
        return {
            text: result.data.text,
            confidence: result.data.confidence,
            recognizedFields: (0, parseFields_1.parseFields)(result.data.text),
        };
    }
    catch (error) {
        console.error("Error extracting data from image:", error);
        throw new Error(`Image processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.extractData = extractData;
