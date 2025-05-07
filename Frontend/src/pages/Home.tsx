import { useState } from "react";

import UploadCard from "../components/common/CardComponent";
import ActionButton from "../components/common/ButtonComponent";

const AadhaarUpload = () => {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);

  const handleParse = () => {
    // Implement Aadhaar parsing logic here
    console.log("Parsing Aadhaar...");
    console.log("Front file:", frontFile);
    console.log("Back file:", backFile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-sm p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">Upload Aadhaar Card</h2>
        
        <div className="flex flex-col space-y-5 md:space-y-8">
          <div className="w-full">
            <UploadCard 
              title="Aadhaar Front" 
              onFileChange={(file) => setFrontFile(file)} 
            />
          </div>
          
          <div className="w-full">
            <UploadCard 
              title="Aadhaar Back" 
              onFileChange={(file) => setBackFile(file)} 
            />
          </div>
          
          <div className="pt-2 flex justify-center">
            <ActionButton 
              onClick={handleParse}
              disabled={!frontFile || !backFile}
            >
              PARSE AADHAAR
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AadhaarUpload;