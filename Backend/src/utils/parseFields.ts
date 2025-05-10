import { AadhaarFields } from "../types/AadharFields";

export const parseFields = (text: string): AadhaarFields => {
  const fields: AadhaarFields = {};

  const aadhaarMatch = text.match(/\b(\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/);
  if (aadhaarMatch) fields.aadhaarNumber = aadhaarMatch[1].replace(/\s|-/g, "");

  const nameMatch = text.match(
    /name[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
  );
  if (nameMatch) fields.name = nameMatch[1].trim();

  const dobMatch = text.match(
    /(?:dob|birth)[:\-]?\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i
  );
  if (dobMatch) fields.dob = dobMatch[1];

  const genderMatch = text.match(/\b(Male|Female|Other)\b/i);
  if (genderMatch) fields.gender = genderMatch[1];

  const pincodeMatch = text.match(/\b[1-9][0-9]{5}\b/);
  if (pincodeMatch) fields.pincode = pincodeMatch[0];

  const addressMatch = text.match(/Address[:\-]?\s*(.+?)(?:\n|$)/i);
  if (addressMatch) fields.address = addressMatch[1].trim();

  return fields;
};