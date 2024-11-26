import React from "react";

interface NewPurchaseOrderProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewPurchaseOrder: React.FC<NewPurchaseOrderProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
      {/* Fullscreen Modal */}
      <div className="bg-white w-full h-full shadow-lg ">
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
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Section */}
            <div className="border-dashed border-2 border-gray-300 rounded-md h-40 flex flex-col justify-center items-center text-gray-600">
              <p className="mb-2 text-sm">
                Drag PDF file here or click to upload.
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
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center bg-gray-100 px-4 py-3 border-t">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Confirm Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;
