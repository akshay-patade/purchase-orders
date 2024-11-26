import React, { useState } from "react";
import UploadPurchaseModal from "./UploadPurchaseModal";

interface NewPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewPurchaseOrderModal: React.FC<NewPurchaseOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  type MenuOption = "Upload" | "Extract" | "Match";
  const [activeTab, setActiveTab] = useState<string>("Upload");

  const renderContent = () => {
    switch (activeTab) {
      case "Upload":
        return <UploadPurchaseModal />;
      case "Extract":
        return <div>Extract Modal will be rendered</div>;
      case "Match":
        return <div>Match Modal will be rendered</div>;

      default:
        return <UploadPurchaseModal />;
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      {/* Fullscreen Modal */}
      <div className="bg-white w-full max-h-screen h-full min-h-screen flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Process Order</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>
        {/* Modal Body */}
        <div className="flex-grow p-6 overflow-y-auto sm:overflow-y-none h-full">
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* File Upload Section */}
            <div className="h-full border-dashed border-2 border-gray-300 rounded-md  flex flex-col justify-center items-center text-gray-600">
              <p className="mb-2 text-sm">
                Drag PDF file here or click to upload the file data
              </p>
              <button className="bg-gray-200 px-4 py-2 rounded-md text-gray-700">
                Upload
              </button>
            </div>

            {/* Purchase Order Information Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Request ID
                </label>
                <input
                  type="text"
                  value="1730261419548"
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Extract PO Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Extract Delivery Address
                </label>
                <input
                  type="text"
                  placeholder="Address"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Extract PO Number
                </label>
                <input
                  type="text"
                  placeholder="PO Number"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Navigation bar for Upload, Extract and Match */}

              <nav>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-center space-x-8 h-16 items-center">
                    <button
                      onClick={() => setActiveTab("Upload")}
                      className={`
                px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
                  activeTab === "Upload"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }
              `}
                    >
                      Upload
                    </button>

                    <button
                      onClick={() => setActiveTab("Extract")}
                      className={`
                px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
                  activeTab === "Extract"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }
              `}
                    >
                      Extract
                    </button>

                    <button
                      onClick={() => setActiveTab("Match")}
                      className={`
                px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
                  activeTab === "Match"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }
              `}
                    >
                      Match
                    </button>
                  </div>
                </div>
              </nav>

              <div className="flex-1 p-3 sm:ml-64">{renderContent()}</div>
            </div>
          </div>
        </div>
        {/* Modal Footer */}
      </div>
    </div>
  );
};

export default NewPurchaseOrderModal;
