import { useState } from "react";
import UploadCard from "../components/common/CardComponent";
import ActionButton from "../components/common/ButtonComponent";
import ParsedDetails from "../components/common/ParsedDetailsComponent";
import { useParseAadhaarImageMutation } from "../store/slices/apiSlices";
import type { AadhaarFields } from "../types/aadharTypes";
import { toast } from "react-toastify";

const AadhaarUpload = () => {
  const [parseAadhar] = useParseAadhaarImageMutation();
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [parsedDetails, setParsedDetails] = useState<AadhaarFields>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleParse = async () => {
    if (!frontFile || !backFile) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("frontImage", frontFile);
      formData.append("backImage", backFile);

      const res = await parseAadhar(formData).unwrap();
      if (res.success) {
        toast.success("parsed successfully");
      }
      setParsedDetails(res?.data?.combined?.extractedFields);
    } catch (error) {
      let errorMessage = "Something went wrong";

      if (typeof error === "object" && error !== null) {
        if (
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data
        ) {
          errorMessage = (error.data as { message: string }).message;
        } else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFrontFile(null);
    setBackFile(null);
    setParsedDetails({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-sm p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload Aadhaar Card
        </h2>

        <div className="flex flex-col space-y-5 md:space-y-8">
          <div className="w-full">
            <UploadCard
              title="Aadhaar Front"
              onFileChange={(file: File | null) => setFrontFile(file)}
              file={frontFile}
            />
          </div>

          <div className="w-full">
            <UploadCard
              title="Aadhaar Back"
              onFileChange={(file: File | null) => setBackFile(file)}
              file={backFile}
            />
          </div>

          <div className="pt-2 flex justify-center">
            {isLoading ? (
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-gray-600"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            ) : Object.keys(parsedDetails).length === 0 ? (
              <ActionButton
                onClick={handleParse}
                disabled={!frontFile || !backFile}
              >
                PARSE AADHAAR
              </ActionButton>
            ) : (
              <ActionButton onClick={handleReset}>RESET</ActionButton>
            )}
          </div>

          {Object.keys(parsedDetails).length > 0 && (
            <ParsedDetails aadhaarDetails={parsedDetails} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarUpload;
