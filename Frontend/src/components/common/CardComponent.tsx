import { useState } from "react";

const UploadCard = ({ title, onFileChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      onFileChange(file);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-gray-500 font-medium mb-2 text-sm sm:text-base">{title}</h3>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt={`${title} Preview`}
              className="w-full object-contain max-h-96"
            />
            <button 
              onClick={() => {
                setPreviewUrl(null);
                onFileChange(null);
              }} 
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 cursor-pointer border-2 border-dashed border-gray-200 rounded hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById(`file-${title}`).click()}
          >
            <div className="bg-blue-500 text-white p-2 sm:p-3 rounded-full mb-2 sm:mb-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-blue-500 text-xs sm:text-sm font-medium">Click here to Upload/Capture</p>
            <input
              id={`file-${title}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              capture="environment"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;