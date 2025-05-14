export const checkIfAadhaar = (text: string): boolean => {
  const fullText = text.toLowerCase();

  // Aadhaar number format: 4 digits + space + 4 digits + space + 4 digits
  const aadhaarNumberRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;

  // Aadhaar-specific unique keywords
  const aadhaarKeywords = [
    'uidai',
    'aadhaar',
    'unique identification authority of india',
    'government of india'
  ];

  const hasAadhaarNumber = aadhaarNumberRegex.test(fullText);
  const hasAadhaarKeyword = aadhaarKeywords.some(keyword => fullText.includes(keyword));

  // Return true if Aadhaar number or Aadhaar-specific keyword is found
  return hasAadhaarNumber || hasAadhaarKeyword;
};
