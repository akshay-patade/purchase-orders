import React, { useState } from "react";
import NewPurchaseOrderModal from "../components/NewPurchaseOrderModal";

const PurchaseOrder: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="pt-1">
      <div className="flex justify-between pt-3">
        <h1 className="text-xl sm:text-3xl font-bold text-white">
          Purchase Orders
        </h1>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white  rounded-md py-2 px-4"
          onClick={openModal}
        >
          New Purchase Order
        </button>
      </div>
      <hr className="border-t border-gray-300 my-2" />

      {/*Modal code*/}
      <NewPurchaseOrderModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default PurchaseOrder;
