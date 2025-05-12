import { AadhaarFields } from "../types/AadharFields";

export const parseFields = (text: string): AadhaarFields => {

  const fields: AadhaarFields = {
    name: "",
    dob: "",
    gender: "",
    aadhaarNumber: "",
    address: "",
    pincode: "",
  };

  const cleanedText = text.replace(/\s+/g, " ").trim();
  const lines = text.split("\n").filter((line) => line.trim().length > 0);

  // Extract Aadhaar number
  const aadhaarNumberRegex = /(\d{4}\s*\d{4}\s*\d{4})/;
  const aadhaarMatch = text.match(aadhaarNumberRegex);
  if (aadhaarMatch) {
    fields.aadhaarNumber = aadhaarMatch[1].replace(/\s/g, "");
  }

  // Extract DOB
  const dobRegexes = [
    /DOB:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /Date of Birth:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /Birth:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /जन्म\s*तिथि:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i, // Hindi
    /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/i, // Standalone date format
  ];

  // Look for DOB in context
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/\b(dob|date of birth|birth|जन्म तिथि)\b/i.test(line)) {
      for (const regex of dobRegexes) {
        const dobMatch = line.match(regex);
        if (dobMatch) {
          fields.dob = dobMatch[1];
          break;
        }
      }

      // If no DOB found in this line but it contains DOB label,
      // check the next line for just a date
      if (!fields.dob && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const dateOnlyMatch = nextLine.match(
          /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/
        );
        if (dateOnlyMatch) {
          fields.dob = dateOnlyMatch[1];
        }
      }

      if (fields.dob) break;
    }
  }

  // If still no DOB, try general search
  if (!fields.dob) {
    for (const regex of dobRegexes) {
      const dobMatch = text.match(regex);
      if (dobMatch) {
        fields.dob = dobMatch[1];
        break;
      }
    }
  }

  // Extract gender - look for common gender identifiers in multiple languages
  const genderPatterns = {
    male: [/\bmale\b/i, /\bपुरुष\b/i],
    female: [/\bfemale\b/i, /\bमहिला\b/i, /\bस्त्री\b/i],
  };

  for (const pattern of genderPatterns.male) {
    if (pattern.test(text)) {
      fields.gender = "Male";
      break;
    }
  }

  if (!fields.gender) {
    for (const pattern of genderPatterns.female) {
      if (pattern.test(text)) {
        fields.gender = "Female";
        break;
      }
    }
  }

  // Function to check if a string is likely a name (not noise)
  const isLikelyName = (str: string): boolean => {
    const cleanStr = str.replace(/^[^a-zA-Z]+/, "").trim(); // Remove leading numbers/symbols

    const noisePatterns = [
      /aadhaar/i,
      /unique/i,
      /identity/i,
      /identification/i,
      /government/i,
      /india/i,
      /authority/i,
      /uidai/i,
      /भारत/i,
      /सरकार/i,
      /प्राधिकरण/i,
      /to the bearer/i,
      /verify/i,
      /www/i,
      /http/i,
      /@/i,
      /help/i,
      /download/i,
      /\b(dob|date of birth|birth|जन्म तिथि)\b/i,
      /\b(male|female)\b/i, // Exclude gender terms like Male/Female
    ];

    if (cleanStr.length < 3 || cleanStr.length > 50) return false;

    for (const pattern of noisePatterns) {
      if (pattern.test(cleanStr)) return false;
    }

    const words = cleanStr.split(/\s+/).filter((w) => w.length > 1);
    if (words.length < 1 || words.length > 5) return false;

    const hasProperCase = words.some((word) => /^[A-Z]/.test(word));
    return hasProperCase;
  };

  // Clean up the name by removing extra single characters or words
  const cleanUpName = (str: string): string => {
    let cleanStr = str.replace(/^[^a-zA-Z]+/, "").trim(); // Remove leading non-letter characters

    if (cleanStr.split(" ")[0].length === 1) {
      cleanStr = cleanStr.substring(cleanStr.indexOf(" ") + 1).trim();
    }

    // Remove gender terms like "Male", "male"
    cleanStr = cleanStr.replace(/\b(male|female)\b/i, "").trim();

    return cleanStr;
  };

  // Extract name from lines before DOB
  let dobLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/\b(dob|date of birth|birth|जन्म तिथि)\b/i.test(lines[i])) {
      dobLineIndex = i;
      break;
    }
  }

  if (dobLineIndex > 0) {
    for (let i = dobLineIndex - 1; i >= Math.max(0, dobLineIndex - 3); i--) {
      const line = lines[i].trim();
      const cleanedLine = cleanUpName(line);
      if (isLikelyName(cleanedLine)) {
        fields.name = cleanedLine;
        break;
      }
    }
  }

  // If not found, fallback to top 5 lines
  if (!fields.name) {
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      const cleanedLine = cleanUpName(line);
      if (isLikelyName(cleanedLine)) {
        fields.name = cleanedLine;
        break;
      }
    }
  }


  // Helper function to determine if a line is likely part of an address
  const isAddressLine = (line: string): boolean => {
    const addressIndicators = [
      /house|road|street|lane|village|town|city|district|state|p\.?o\.?|post|pin|c\/o/i,
      /building|apartment|flat|floor|sector|block|phase|colony|area|tehsil|taluk/i,
      /нагар|गांव|मकान|पोस्ट|राज्य|जिला|तहसील|भवन/i, // Hindi address terms
      /\b\d{6}\b/, // Pincode
      /kerala|karnataka|tamil|nadu|andhra|telangana|maharashtra|gujarat|punjab|haryana|uttar|madhya|pradesh|rajasthan|bihar|assam|odisha|west bengal|goa/i, // Indian states
    ];

    for (const indicator of addressIndicators) {
      if (indicator.test(line)) return true;
    }

    return false;
  };

  const addressPatterns = [
    /Address:?\s*(.+?)(?:\n\n|\n[A-Z]|$)/is,
    /पता:?\s*(.+?)(?:\n\n|\n[A-Z]|$)/is, // Hindi
    /C\/O:?\s*(.+?)(?:\n\n|\n[A-Z]|$)/is,
  ];

  const cleanTextForAddress = text
    .replace(/[^\w\s\-\/:,\.\n]/g, " ") // Remove most special chars but keep address-relevant ones
    .replace(/\s+/g, " ")
    .trim();

  for (const pattern of addressPatterns) {
    const addressMatch = cleanTextForAddress.match(pattern);
    if (addressMatch && addressMatch[1]) {
      // Clean up the extracted address
      let extractedAddress = addressMatch[1]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(", ")
        .replace(/\s+/g, " ")
        .replace(/,+/g, ",")
        .trim();

      // Remove any remaining single characters or noise
      extractedAddress = extractedAddress
        .split(", ")
        .filter((part) => part.length > 2 || /\d/.test(part))
        .join(", ");

      fields.address = extractedAddress;
      break;
    }
  }

  // If still no address, try to find address block after "Address:" or "C/O:"
  if (!fields.address) {
    const addressLines: string[] = [];
    let collectingAddress = false;

    for (const line of lines) {
      const cleanLine = line
        .replace(/[^\w\s\-\/:,\.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (/Address:|C\/O:/i.test(cleanLine)) {
        // Start collecting from this line
        collectingAddress = true;
        const addressPart = cleanLine.split(/Address:|C\/O:/i)[1]?.trim();
        if (addressPart) addressLines.push(addressPart);
      } else if (collectingAddress) {
        // Stop collecting if we hit certain markers
        if (/VID:|help|www|uidai\.gov\.in/i.test(cleanLine)) {
          break;
        }

        // Only add meaningful lines
        if (cleanLine.length > 5 || /\d{6}/.test(cleanLine)) {
          addressLines.push(cleanLine);
        }
      }
    }

    if (addressLines.length > 0) {
      fields.address = addressLines
        .join(", ")
        .replace(/,+/g, ",")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  if (fields.address) {
    const cleanAddress = (address: string): string => {
      const parts = address
        .split(",")
        .map((part) => part.trim())
        .filter((part) => {
          if (part.length <= 2) return false;

          // Remove parts that are clearly noise (adjust as needed)
          const noisePatterns = [
            /^[^a-zA-Z0-9]+$/, // Only special chars
            /^[a-z]{1,2}$/i, // 1-2 letter words
            /ies Sr CE/, // Specific noise strings
            /Sarena/,
            /Shs Sa/,
            /et An/,
            /Sach sat SALE/,
            /Fav roan/,
            /Fok a/,
            /a ale/,
            /gh Pale/,
            /Tn Rea i/,
            /fi Te 1 Ter/,
            /a SRE i:/,
            /aE Ei/,
            /y VID/,
            /help uidai.gov.in/,
            /www. uidai.gov.in/,
          ];

          return !noisePatterns.some((pattern) => pattern.test(part));
        })
        .map((part) => {
          // Clean individual parts
          return part
            .replace(/[^a-zA-Z0-9\s\-\.\:\/]/g, " ") // Keep only address-relevant chars
            .replace(/\s+/g, " ")
            .trim();
        });

      // Join meaningful parts and do final cleanup
      let cleaned = parts
        .join(", ")
        .replace(/\bDIST\b[^\w]*([A-Za-z ]+)/i, (match, p1) => `DIST: ${p1.trim()}`)
        .replace(/\bCIRC Ro\b/i, "") // Remove CIRC Ro if present
        .replace(/,+/g, ",")
        .replace(/,\s*,/g, ",")
        .replace(/\s+/g, " ")
        .trim();

      // Ensure pincode format is clean
      cleaned = cleaned.replace(/(\d{6})(?:\D|$)/, "$1");

      return cleaned;
    };

    const forceStartFromRelation = (address: string): string => {
      const startKeywords = /(C\/O|S\/O|D\/O|W\/O|H\/O)\s*[:\-]?\s*/i;
      const match = address.match(startKeywords);
      if (match && match.index !== undefined) {
        return address.slice(match.index).trim();
      }
      return address;
    };

    let cleaned = cleanAddress(fields.address);
    cleaned = forceStartFromRelation(cleaned);
    fields.address = cleaned;
  }

  // Extract pincode first as it helps validate the address
  const pincodeRegex = /\b(\d{6})\b/;
  const pincodeMatch = cleanTextForAddress.match(pincodeRegex);
  if (pincodeMatch) {
    fields.pincode = pincodeMatch[1];

    // Remove pincode from address if it's at the end
    if (fields.address && fields.address.endsWith(fields.pincode)) {
      fields.address = fields.address
        .replace(new RegExp(`,\\s*${fields.pincode}$`), "")
        .trim();
    }

    // Add pincode back in clean format if it's not already there
    if (fields.address && !fields.address.includes(fields.pincode)) {
      fields.address += ` - ${fields.pincode}`;
    }
  }

  // Final cleanup of address
  if (fields.address) {
    fields.address = fields.address
      .replace(/,+/g, ",") // Remove duplicate commas
      .replace(/,\s*$/, "") // Remove trailing comma
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  }

  // [Rest of your existing code remains the same...]
  // Return only non-empty fields
  return Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value.trim() !== "")
  ) as AadhaarFields;
};
