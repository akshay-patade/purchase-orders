import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

import {
  ExtractPurchaseOrdersApiResponse,
  ExtractPurchaseOrders,
} from "../schemas/ExtractPurchaseOrdersApiResponseSchema";

interface MatchPurchaseModalProps {
  mappingsData: ExtractPurchaseOrdersApiResponse | null;
}

const MatchPurchaseModal: React.FC<MatchPurchaseModalProps> = ({
  mappingsData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [matchingResponse, setMatchingResponse] = useState(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<ExtractPurchaseOrders | null>(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleEdit = (data: ExtractPurchaseOrders, index: number) => {
    setError(null);
    setEditData(data);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchbestMappings = async () => {
      try {
        setIsLoading(true);
        if (mappingsData && mappingsData?.length > 0) {
          const productDescriptions = mappingsData.map(
            (item) => item.product_description
          );

          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/product/productMatching/`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ queries: productDescriptions }),
            }
          );

          if (!res.ok) {
            throw new Error(
              "Failed to find the matching. There should be atleast one data inorder to perform matching"
            );
          }

          const result = await res.json();
          const temp = result["queries"];

          //This query is executed to update the best match for every order detail
          setMatchingResponse(temp);

          if (temp) {
            const apiCalls = mappingsData.map((data, index) => {
              console.log("Printing the order id");
              console.log(data["id"]);
              const body = {
                id: data.id,
                best_match: temp[index]["matches"][0]["description"],
              };

              return fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/order/order-details/${data["id"]}/`,
                {
                  method: "PATCH",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(body),
                }
              );
            });

            await Promise.all(apiCalls);
          }

          console.log(temp);
        } else {
          setError(
            "Please Upload the Document First, extract the document and then try the matching process"
          );
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
        setIsLoading(false);
      }
    };

    if (mappingsData && mappingsData.length > 0) {
      setIsLoading(true);
      fetchbestMappings();
    } else {
      setError(
        "Please Upload the Document First, extract the document and then try the matching process"
      );
    }
  }, []);

  return (
    <div className="flex justify-center items-center">
      {isLoading ? (
        <Spinner size="large" color="text-red-500" />
      ) : error ? (
        <div className="bg-red-500 text-white p-4 rounded-md shadow-md">
          <p>{error}</p>
        </div>
      ) : (
        <div className="p-4 w-full">
          <div className="overflow-x-auto">
            {mappingsData && matchingResponse && mappingsData.length > 0 && (
              <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Item Number</th>
                    <th className="border px-4 py-2 text-left">
                      Product Description
                    </th>
                    <th className="border px-4 py-2 text-left">Best Match</th>
                    <th className="border px-4 py-2 text-left">Quantity</th>
                    <th className="border px-4 py-2 text-left">Unit Price</th>
                    <th className="border px-4 py-2 text-left">Total</th>
                    <th className="border px-4 py-2 text-left">
                      Vendor Number
                    </th>
                    <th className="border px-4 py-2 text-left">Edit Product</th>
                  </tr>
                </thead>
                <tbody>
                  {mappingsData.map((product, index) => (
                    <tr key={product["id"]} className="text-gray-100">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {product["product_description"]}
                      </td>
                      <td className="border px-4 py-2">
                        {matchingResponse[index]["matches"][0]["description"]}
                      </td>
                      <td className="border px-4 py-2">
                        {product["quantity"]}
                      </td>
                      <td className="border px-4 py-2">
                        {product["unit_price"]}
                      </td>
                      <td className="border px-4 py-2">
                        {parseFloat(product["total"] || "0").toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        {product["vendor_number"]}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleEdit(product, index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showModal && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-4 w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Order Details</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Description</label>
                <input
                  type="text"
                  value={editData.product_description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      product_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium"></label>
                <input
                  type="text"
                  value={editData.product_description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      product_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  value={editData.quantity || "1"}
                  onChange={(e) =>
                    setEditData({ ...editData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Unit Price</label>
                <input
                  type="number"
                  value={editData.unit_price || "1"}
                  onChange={(e) =>
                    setEditData({ ...editData, unit_price: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Total</label>
                <input
                  type="number"
                  value={editData.total || "1"}
                  onChange={(e) =>
                    setEditData({ ...editData, total: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Vendor Number
                </label>
                <input
                  type="text"
                  value={editData.vendor_number || "N/A"}
                  onChange={(e) =>
                    setEditData({ ...editData, vendor_number: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  // onClick={handleModalSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchPurchaseModal;
