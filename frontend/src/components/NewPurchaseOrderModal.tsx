import React, { useState, useRef } from "react";
import UploadPurchaseModal from "./UploadPurchaseModal";
import ExtractPurchaseModal from "./ExtractPurchaseModal";
import { ExtractPurchaseOrdersApiResponse } from "../schemas/ExtractPurchaseOrdersApiResponseSchema";

interface NewPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order_id?: number;
  order_process_date?: string;
}

const NewPurchaseOrderModal: React.FC<NewPurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  order_id,
  order_process_date,
}) => {
  const [activeTab, setActiveTab] = useState<string>("Upload");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [mappingsData, setMappingsData] =
    useState<ExtractPurchaseOrdersApiResponse | null>(null); // This State is used to store the mappings we get from the extraction api. In order to avoid mulitple api request

  const [currentView, setCurrentView] = useState<
    "Upload" | "Extract" | "Match"
  >("Upload");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the actual file in state
      const previewUrl = URL.createObjectURL(selectedFile); // Generate a preview URL
      setFileUrl(previewUrl);
    }
  };

  const clearPreview = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl); // Clean up the URL
      setFileUrl(null);
    }
    setFile(null); // Clear the file state
    setMappingsData(null);
  };

  const handleGenerateMappings = () => {
    setActiveTab("Extract");
    setCurrentView("Extract");
  };

  const handleNewPurchaseModalClose = () => {
    //Call the clearPreview resource to free the resouce and then call the Onclose function to close the modal
    clearPreview();
    onClose();
  };

  const renderContent = () => {
    switch (currentView) {
      case "Upload":
        return (
          <UploadPurchaseModal
            clearFile={clearPreview}
            handleGenerateMappings={handleGenerateMappings}
          />
        );
      case "Extract":
        return (
          <ExtractPurchaseModal
            file={file}
            mappingsData={mappingsData}
            setMappingsData={setMappingsData}
          />
        );
      case "Match":
        return <div>Match Modal will be rendered</div>;

      default:
        return (
          <UploadPurchaseModal
            clearFile={clearPreview}
            handleGenerateMappings={handleGenerateMappings}
          />
        );
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fullscreen Modal */}
      <div className="bg-gray-800 w-full max-h-screen h-full min-h-screen flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center text-white text-lg font-bold px-4 py-3 border-b">
          <h2>Process Order</h2>
          <button onClick={handleNewPurchaseModalClose}>X</button>
        </div>
        {/* Modal Body */}
        <div className="flex-grow p-6 overflow-y-auto sm:overflow-y-none h-full">
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* File Upload Section */}
            <div className="h-full border-dashed border-2 border-gray-300 text-white rounded-md  flex flex-col justify-center items-center">
              <label
                htmlFor="fileInput"
                className="block mb-2 text-sm font-medium"
              >
                Click to upload the file data.
              </label>

              <input
                type="file"
                id="fileInput"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="block w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />

              {fileUrl ? (
                <div className="relative w-full h-full border rounded-md">
                  <iframe
                    src={fileUrl}
                    title="Document Preview"
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <p className="text-white">No document selected</p>
              )}
            </div>

            {/* Purchase Order Information Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-large text-gray-400">
                  Order Date
                </label>
                <input
                  type="text"
                  value={order_id || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md  focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                />
              </div>
              {order_process_date && (
                <div>
                  <label className="block text-md font-medium text-gray-400">
                    Order Processed Date
                  </label>
                  <input
                    type="date"
                    value={order_process_date}
                    className="mt-1 block w-full rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                  />
                </div>
              )}

              {/* Navigation bar for Upload, Extract and Match */}

              <nav>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-center space-x-8 h-16 items-center">
                    <button
                      onClick={() => {
                        setActiveTab("Upload");
                        setCurrentView("Upload");
                      }}
                      className={`
                px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
                  activeTab === "Upload"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-white hover:text-blue-600"
                }
              `}
                    >
                      Upload
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("Extract");
                        setCurrentView("Extract");
                      }}
                      className={`
                px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
                  activeTab === "Extract"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-white hover:text-blue-600"
                }
              `}
                    >
                      Extract
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("Match");
                        setCurrentView("Match");
                      }}
                      className={`
                px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
                  activeTab === "Match"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-white hover:text-blue-600"
                }
              `}
                    >
                      Match
                    </button>
                  </div>
                </div>
              </nav>

              <div>{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseOrderModal;
