import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

interface Order {
  id: number;
  file: string;
  uploaded_at: string;
  process_status: string;
}

interface PurchaseOrderListProps {
  orderId: string;
  fileUrl: string;
  uploadedAt: string;
  orderProcessStatus: string;

  setOrderId: React.Dispatch<React.SetStateAction<string>>;
  setFileUrl: React.Dispatch<React.SetStateAction<string>>;
  setUploadedAt: React.Dispatch<React.SetStateAction<string>>;
  setOrderProcessStatus: React.Dispatch<React.SetStateAction<string>>;
  setNewPurchaseOrderModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PurchaseOrderList: React.FC<PurchaseOrderListProps> = ({
  orderId,
  fileUrl,
  uploadedAt,
  orderProcessStatus,
  setOrderId,
  setUploadedAt,
  setOrderProcessStatus,
  setNewPurchaseOrderModal,
  setFileUrl,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = (index: number) => {
    const fetchOrderId = orders[index]["id"].toString();
    const fetchUploadedAt = orders[index]["uploaded_at"];
    const fetchOrderProcesStatus = orders[index]["process_status"];
    const fetchFileUrl = orders[index]["file"];

    setOrderId(fetchOrderId);
    setFileUrl(fetchFileUrl);
    setUploadedAt(fetchUploadedAt);
    setOrderProcessStatus(fetchOrderProcesStatus);
    setNewPurchaseOrderModal(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/order/getOrders/`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to get the Orders");
        }

        const data = await response.json();
        setOrders(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen text-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" color="text-blue-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-xl">
            No Orders found. Please Click on Purchase Orders to create new order
          </h1>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-100">Order List</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-gray-700 shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => handleClick(index)}
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-100">
                  Order #{order.id}
                </h2>
                <p
                  className={`
  ${
    order.process_status.toLowerCase() === "processed"
      ? "text-red-500"
      : order.process_status.toLowerCase() === "final"
      ? "text-green-500"
      : "text-gray-300"
  }
`}
                >
                  Status: {order.process_status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderList;
