import React from "react";

type MenuOption = "Upload" | "Extract" | "Match";

interface UploadPurchaseModalProps {
  file: File | null;
  clearFile: () => void;
  handleGenerateMappings: () => void;
}

const UploadPurchaseModal: React.FC<UploadPurchaseModalProps> = ({
  file,
  clearFile,
  handleGenerateMappings,
}) => {
  return (
    <div className="flex justify-center gap-x-2">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleGenerateMappings}
      >
        Generate Mappings
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={clearFile}
      >
        Remove File
      </button>
    </div>
  );
};

export default UploadPurchaseModal;
