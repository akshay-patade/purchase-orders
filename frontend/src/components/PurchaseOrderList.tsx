import React from "react";
import PurchaseOrderTable from "./PurchaseOrderTable";

const PurchaseOrderList: React.FC = () => {
  return (
    <div className="flex-grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
          New Purchase Order
        </button>
      </div>
      <div className="flex space-x-4 my-4">
        <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded">
          All
        </button>
        <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded">
          Processing
        </button>
        <button className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded">
          Review
        </button>
        <button className="bg-green-100 text-green-600 px-4 py-2 rounded">
          Finalized
        </button>
        <button className="bg-red-100 text-red-600 px-4 py-2 rounded">
          Failed
        </button>
      </div>
      <PurchaseOrderTable />
    </div>
  );
};

export default PurchaseOrderList;
