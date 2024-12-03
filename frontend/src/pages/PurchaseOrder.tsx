import React, { useState } from "react";
import NewPurchaseOrderModal from "../components/NewPurchaseOrderModal";
import PurchaseOrderList from "../components/PurchaseOrderList";
import { getFormattedDate } from "../helpers";

const PurchaseOrder: React.FC = () => {
  const formattedDate = getFormattedDate();

  const [isNewPurchaseOrderModal, setNewPurchaseOrderModal] = useState(false);
  const openNewPurchaseOrderModal = () => setNewPurchaseOrderModal(true);
  const closeNewPurchaseOrderModal = () => setNewPurchaseOrderModal(false);

  const [orderId, setOrderId] = useState<string>("");
  const [uploadedAt, setUploadedAt] = useState<string>(formattedDate);
  const [orderProcessStatus, setOrderProcessStatus] =
    useState<string>("Processed");

  const [fileUrl, setFileUrl] = useState<string>("");

  return (
    <div className="pt-1">
      <div className="flex justify-between pt-3">
        <h1 className="text-xl sm:text-3xl font-bold text-white">
          Purchase Orders
        </h1>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white  rounded-md py-2 px-4"
          onClick={openNewPurchaseOrderModal}
        >
          New Purchase Order
        </button>
      </div>
      <hr className="border-t border-gray-300 my-2" />

      <PurchaseOrderList
        orderId={orderId}
        fileUrl={fileUrl}
        uploadedAt={uploadedAt}
        orderProcessStatus={orderProcessStatus}
        setOrderId={setOrderId}
        setFileUrl={setFileUrl}
        setUploadedAt={setUploadedAt}
        setOrderProcessStatus={setOrderProcessStatus}
        setNewPurchaseOrderModal={setNewPurchaseOrderModal}
      />

      {/*Modal code*/}
      {isNewPurchaseOrderModal && (
        <NewPurchaseOrderModal
          isNewPurchaseOrderModal={isNewPurchaseOrderModal}
          closeNewPurchaseOrderModal={closeNewPurchaseOrderModal}
          orderId={orderId}
          fileUrl={fileUrl}
          uploadedAt={uploadedAt}
          orderProcessStatus={orderProcessStatus}
          setOrderId={setOrderId}
          setFileUrl={setFileUrl}
          setUploadedAt={setUploadedAt}
          setOrderProcessStatus={setOrderProcessStatus}
        />
      )}
    </div>
  );
};

export default PurchaseOrder;
