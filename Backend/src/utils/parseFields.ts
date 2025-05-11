import { AadhaarFields } from "../types/AadharFields";

export const parseFields = (text: string): AadhaarFields => {
  // Initialize the fields
  const fields: AadhaarFields = {
    name: "",
    dob: "",
    gender: "",
    aadhaarNumber: "",
    address: "",
    pincode: "",
  };

  // Clean the text - remove extra spaces, normalize newlines
  const cleanedText = text.replace(/\s+/g, " ").trim();
  const lines = text.split("\n").filter(line => line.trim().length > 0);

  // Extract Aadhaar number - looking for 12 consecutive digits (may be space-separated)
  const aadhaarNumberRegex = /(\d{4}\s*\d{4}\s*\d{4})/;
  const aadhaarMatch = text.match(aadhaarNumberRegex);
  if (aadhaarMatch) {
    fields.aadhaarNumber = aadhaarMatch[1].replace(/\s/g, "");
  }

  // Extract DOB - improved date format detection
  const dobRegexes = [
    /DOB:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /Date of Birth:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /Birth:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /जन्म\s*तिथि:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i, // Hindi
    /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/i // Standalone date format
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
        const dateOnlyMatch = nextLine.match(/\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/);
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
    female: [/\bfemale\b/i, /\bमहिला\b/i, /\bस्त्री\b/i]
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

  // Improved name extraction

  // Function to check if a string is likely a name (not noise)
  // Improved name extraction to handle edge cases

const isLikelyName = (str: string): boolean => {
  const cleanStr = str.replace(/^[^a-zA-Z]+/, '').trim(); // Remove leading numbers/symbols

  const noisePatterns = [
    /aadhaar/i, /unique/i, /identity/i, /identification/i, /government/i,
    /india/i, /authority/i, /uidai/i, /भारत/i, /सरकार/i, /प्राधिकरण/i,
    /to the bearer/i, /verify/i, /www/i, /http/i, /@/i, /help/i, /download/i,
    /\b(dob|date of birth|birth|जन्म तिथि)\b/i, 
    /\b(male|female)\b/i // Exclude gender terms like Male/Female
  ];

  if (cleanStr.length < 3 || cleanStr.length > 50) return false;

  for (const pattern of noisePatterns) {
    if (pattern.test(cleanStr)) return false;
  }

  const words = cleanStr.split(/\s+/).filter(w => w.length > 1);
  if (words.length < 1 || words.length > 5) return false;

  const hasProperCase = words.some(word => /^[A-Z]/.test(word));
  return hasProperCase;
};

// Clean up the name by removing extra single characters or words like "S " at the start
const cleanUpName = (str: string): string => {
  let cleanStr = str.replace(/^[^a-zA-Z]+/, '').trim();  // Remove leading non-letter characters

  // Remove single-letter prefixes like 'S' in 'S Safiya Muhammad'
  if (cleanStr.split(" ")[0].length === 1) {
    cleanStr = cleanStr.substring(cleanStr.indexOf(" ") + 1).trim();
  }

  // Remove gender terms like "Male", "male"
  cleanStr = cleanStr.replace(/\b(male|female)\b/i, '').trim();

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


  // Improved address extraction

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

  // Start address extraction

  // APPROACH 1: Look for explicit address label
  const addressPatterns = [
    /Address:?\s*(.+?)(?:\n\n|\n[A-Z]|$)/is,
    /पता:?\s*(.+?)(?:\n\n|\n[A-Z]|$)/is, // Hindi
    /C\/O:?\s*(.+?)(?:\n\n|\n[A-Z]|$)/is
  ];

  for (const pattern of addressPatterns) {
    const addressMatch = text.match(pattern);
    if (addressMatch && addressMatch[1]) {
      fields.address = addressMatch[1]
        .replace(/\n/g, ', ')
        .replace(/\s+/g, ' ')
        .trim();
      break;
    }
  }

  // APPROACH 2: Identify a block of address-like content
  if (!fields.address) {
    const addressLines: string[] = [];
    let inAddress = false;
    let addressScore = 0;
    let continuousAddressLines = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip obviously non-address lines
      if (/help|download|extract|verify|uidai\.gov|@uidai|VID|आधार|enrolment/i.test(line)) {
        if (inAddress) {
          // If we were in an address block, this might be the end
          if (continuousAddressLines >= 2) break;
          inAddress = false;
          continuousAddressLines = 0;
        }
        continue;
      }
      
      const isCurrentLineAddress = isAddressLine(line);
      
      // If this looks like an address line
      if (isCurrentLineAddress) {
        inAddress = true;
        addressLines.push(line);
        addressScore += 2;
        continuousAddressLines++;
      } 
      // If we're already collecting address and this could be continuation
      else if (inAddress && line.length > 3 && !/Government|Authority|Operator|भारतीय|विशिष्ट|पहचान|प्राधिकरण/i.test(line)) {
        addressLines.push(line);
        addressScore += 1;
        continuousAddressLines++;
      } 
      // If line doesn't look like address but we've collected enough
      else if (inAddress && continuousAddressLines >= 2) {
        break;
      }
      // Reset if not part of address
      else {
        inAddress = false;
        continuousAddressLines = 0;
      }
    }
    
    // If we found something that looks like an address
    if (addressScore >= 3 && addressLines.length > 0) {
      fields.address = addressLines.join(', ');
    }
  }

  // APPROACH 3: Look for address after key identity details
  if (!fields.address) {
    // Find position after name, gender, DOB sections
    let startIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (
        (fields.name && lines[i].includes(fields.name)) ||
        (fields.gender && lines[i].toLowerCase().includes(fields.gender.toLowerCase())) ||
        (fields.dob && lines[i].includes(fields.dob))
      ) {
        startIndex = i + 1;
      }
    }
    
    if (startIndex !== -1 && startIndex < lines.length) {
      const potentialAddressLines = [];
      let endIndex = startIndex;
      
      for (let i = startIndex; i < Math.min(lines.length, startIndex + 6); i++) {
        const line = lines[i].trim();
        if (isAddressLine(line)) {
          potentialAddressLines.push(line);
          endIndex = i + 1;
        } else if (potentialAddressLines.length > 0 && !(/help|download|uidai|toll|free/i.test(line))) {
          potentialAddressLines.push(line);
          endIndex = i + 1;
        } else if (potentialAddressLines.length > 0) {
          break;
        }
      }
      
      if (potentialAddressLines.length > 0) {
        fields.address = potentialAddressLines.join(', ');
      }
    }
  }

  // Extract pincode - looking for 6-digit numbers that appear in addresses
  const pincodeRegex = /\b(\d{6})\b/g;
  const pincodeMatches = [...text.matchAll(pincodeRegex)];
  
  if (pincodeMatches.length > 0) {
    // If multiple matches, prefer the one that appears near address-related content
    for (const match of pincodeMatches) {
      if (!match.index) continue;
      
      const surroundingText = text.substring(
        Math.max(0, match.index - 50), 
        Math.min(text.length, match.index + 56)
      );
      
      if (/address|village|town|state|district|pin\s*code|kerala|karnataka|tamil|post/i.test(surroundingText)) {
        fields.pincode = match[1];
        break;
      }
    }
    
    // If no context match, use the first pincode
    if (!fields.pincode && pincodeMatches.length > 0) {
      fields.pincode = pincodeMatches[0][1];
    }
  }

  // Extract pincode from address if we've missed it
  if (!fields.pincode && fields.address) {
    const addressPincodeMatch = fields.address.match(/\b(\d{6})\b/);
    if (addressPincodeMatch) {
      fields.pincode = addressPincodeMatch[1];
      
      // Remove pincode from address to avoid duplication
      fields.address = fields.address.replace(/\b\d{6}\b/, '').replace(/,\s*$/, '').trim();
    }
  }

  // Clean up the address
  if (fields.address) {
    fields.address = fields.address
      .replace(/,\s*,/g, ',') // Remove double commas
      .replace(/\s+/g, ' ')   // Normalize spaces
      .replace(/,\s*$/, '')   // Remove trailing comma
      .trim();
  }

  // Return only non-empty fields
  return Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value.trim() !== "")
  ) as AadhaarFields;
};