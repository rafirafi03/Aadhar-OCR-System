import { AadhaarFields } from "./AadharFields";

export interface ExtractedData {
  text: string;
  confidence: number;
  recognizedFields?: AadhaarFields;
}