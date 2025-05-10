import { useState } from "react";
import UploadCard from "../components/common/CardComponent";
import ActionButton from "../components/common/ButtonComponent";
import { useParseAadhaarImageMutation } from "../store/slices/apiSlices";

const AadhaarUpload = () => {

  const [parseAadhar] = useParseAadhaarImageMutation()
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const handleParse = async() => {
    if(!frontFile || !backFile) return
    try {
      const formData = new FormData()

      formData.append('frontImage', frontFile)
      formData.append('backImage', backFile)

      const res = await parseAadhar(formData).unwrap()

      console.log(res)

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-sm p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">Upload Aadhaar Card</h2>

        <div className="flex flex-col space-y-5 md:space-y-8">
          <div className="w-full">
            <UploadCard
              title="Aadhaar Front"
              onFileChange={(file: File | null) => setFrontFile(file)}
            />
          </div>

          <div className="w-full">
            <UploadCard
              title="Aadhaar Back"
              onFileChange={(file: File | null) => setBackFile(file)}
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
