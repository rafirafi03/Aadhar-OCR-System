import { useState } from "react";
import type { AadhaarFields } from "../../types/aadharTypes";

interface pageProps {
    aadhaarDetails: AadhaarFields
}

// AadhaarDetails component that accepts props with Aadhaar information
const ParsedDetails = ({aadhaarDetails}: pageProps) => {
  const [showDetails, setShowDetails] = useState(true);


  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg">Aadhaar Details</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-white hover:text-blue-200 focus:outline-none"
        >
          {showDetails ? "Hide" : "Show"}
        </button>
      </div>

      {showDetails && (
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">
                {aadhaarDetails?.name || "N/A"}
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Aadhaar Number:</span>
                  <span className="text-gray-700">
                    {aadhaarDetails?.aadhaarNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Date of Birth:</span>
                  <span className="text-gray-700">{aadhaarDetails?.dob || "N/A"}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Gender:</span>
                  <span className="text-gray-700">{aadhaarDetails?.gender || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="font-medium text-gray-700 mb-1">Address</h4>
            <p className="text-gray-600 text-sm mb-2">{aadhaarDetails?.address || "N/A"}</p>

            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Pincode:</span>
              <span className="text-gray-600">{aadhaarDetails?.pincode || "N/A"}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <p>This is an electronic representation of Aadhaar details.</p>
            <p>Kindly verify the details above before proceeding.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParsedDetails;
