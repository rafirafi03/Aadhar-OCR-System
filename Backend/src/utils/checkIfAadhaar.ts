export const checkIfAadhaar = (text: string): boolean => {
  const fullText = text.toLowerCase();

  // Aadhaar number: 4 digits + space + 4 digits + space + 4 digits
  const aadhaarNumberRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;

  // Keywords typically found on front of Aadhaar
  const frontKeywords = [
    'government of india',
    'uidai',
    'aadhaar',
    'unique identification authority'
  ];

  // Keywords typically found on back of Aadhaar (e.g., address or barcode-related text)
  const backKeywords = [
    'year of birth',
    'male',
    'female',
    'care of',
    'c/o',
    'address',
    'pin code',
    'pincode',
    'dob'
  ];

  const hasAadhaarNumber = aadhaarNumberRegex.test(fullText);
  const hasFrontKeyword = frontKeywords.some(keyword => fullText.includes(keyword));
  const hasBackKeyword = backKeywords.some(keyword => fullText.includes(keyword));

  // Aadhaar is valid if either:
  // - Front: number + front keywords
  // - Back: just back keywords (number may not appear)
  const isFrontSide = hasAadhaarNumber && hasFrontKeyword;
  const isBackSide = hasBackKeyword;

  return isFrontSide || isBackSide;
};
