import { AadhaarFields } from "../types/AadharFields";

export const parseFields = (text: string): AadhaarFields => {
  const fields: AadhaarFields = {};

  const aadhaarMatch = text.match(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/);
  if (aadhaarMatch) fields.aadhaarNumber = aadhaarMatch[0].replace(/\s|-/g, "");

  // Look for common Indian name patterns, even without "Name:"
  const nameMatch = text.match(/[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/);
  if (nameMatch) fields.name = nameMatch[0].trim();

  // Accept multiple DOB formats
  const dobMatch = text.match(/(?:\bDOB\b|\bYear\b|\bDoB\b)?.*?(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4})/i);
  if (dobMatch) fields.dob = dobMatch[1];

  // Gender
  const genderMatch = text.match(/\b(Male|Female|Other|MALE|FEMALE|M|F)\b/);
  if (genderMatch) fields.gender = genderMatch[1];

  // Pincode
  const pincodeMatch = text.match(/\b[1-9][0-9]{5}\b/);
  if (pincodeMatch) fields.pincode = pincodeMatch[0];

  return fields;
};
