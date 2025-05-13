"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfAadhaar = void 0;
const checkIfAadhaar = (text) => {
    // Combine both sides' text
    const fullText = text.toLowerCase();
    // Aadhaar usually has these identifiers
    const aadhaarKeywords = [
        'government of india',
        'unique identification authority',
        'aadhaar',
        'uidai'
    ];
    // 12-digit Aadhaar number regex: 4 digits + space + 4 digits + space + 4 digits
    const aadhaarNumberRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
    // Check if any keyword exists
    const hasKeyword = aadhaarKeywords.some(keyword => fullText.includes(keyword));
    // Check for Aadhaar number pattern
    const hasAadhaarNumber = aadhaarNumberRegex.test(fullText);
    // Return true only if both checks pass
    return hasKeyword && hasAadhaarNumber;
};
exports.checkIfAadhaar = checkIfAadhaar;
