import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import {
  ExtractPurchaseOrdersApiResponse,
  ExtractPurchaseOrders,
} from "../schemas/ExtractPurchaseOrdersApiResponseSchema";

interface ExtractPurchaseModalProps {
  file: File | null;
  mappingsData: ExtractPurchaseOrdersApiResponse | null;
  setMappingsData: React.Dispatch<
    React.SetStateAction<ExtractPurchaseOrdersApiResponse | null>
  >;
}

const ExtractPurchaseModal: React.FC<ExtractPurchaseModalProps> = ({
  file,
  mappingsData,
  setMappingsData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<ExtractPurchaseOrders | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [tableError, setTableError] = useState<string | null>(null);

  const handleAddRow = () => {
    const newRow: ExtractPurchaseOrders = {
      product_description: "N/A",
      quantity: "0",
      unit_price: "0.0",
      total: "0.0",
      vendor_number: "N/A",
      item_number: "N/A",
    };

    setEditData(newRow);
    setTableError(null);
    setError(null);

    setShowModal(true); // Open modal for new row
  };

  const handleDelete = async (order_detail_key: string, index: number) => {
    setTableError(null);
    setError(null);
    if (mappingsData && order_detail_key.length > 0) {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/order/order-details/delete/${order_detail_key}/`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to Delete the order detal. Please try again");
        }

        const updatedData = mappingsData.filter((_, i) => i !== index);
        setMappingsData(updatedData);
      } catch (err) {
        if (err instanceof Error) {
          setTableError(err.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    }
  };

  const handleEdit = (data: ExtractPurchaseOrders) => {
    setTableError(null);
    setError(null);
    setEditData(data);
    setShowModal(true);
  };

  const handleModalSave = async () => {
    try {
      setTableError(null);
      setError(null);
      if (editData) {
        if (editData.id) {
          // Editing existing row
          const id = editData["id"] || "1";
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/order/order-details/${id}/`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editData),
            }
          );

          if (!res.ok) {
            throw new Error("Failed to Update the existing row");
          }

          const updatedMappings = mappingsData?.map((item) =>
            item.item_number === editData.item_number ? editData : item
          );
          setMappingsData(updatedMappings || null);
        } else {
          // Adding new row

          const temp = editData;
          temp["order_id"] = orderId;

          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/order/order-details/`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(temp),
            }
          );

          if (!res.ok) {
            throw new Error("Failed to Add a new row. Please try again later ");
          }
          setMappingsData([...(mappingsData || []), editData]);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setTableError(err.message);
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      setShowModal(false);
    }
  };

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        setTableError(null);
        setError(null);
        if (!file) {
          throw new Error("Please Upload a file first and then try again");
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/order/extractOrderDetails/`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to Get the Contents from the data. Please use some other File"
          );
        }

        const result = await res.json();
        const data = result["order_details"];

        const first_data = data[0];

        setOrderId(first_data["order_id"]);
        setMappingsData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          console.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!mappingsData || mappingsData.length === 0) {
      setIsLoading(true);
      fetchMappings();
    }
  }, [file]);

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
            {mappingsData && mappingsData.length > 0 && (
              <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Item Number</th>
                    <th className="border px-4 py-2 text-left">
                      Product Description
                    </th>
                    <th className="border px-4 py-2 text-left">Quantity</th>
                    <th className="border px-4 py-2 text-left">Unit Price</th>
                    <th className="border px-4 py-2 text-left">Total</th>
                    <th className="border px-4 py-2 text-left">
                      Vendor Number
                    </th>
                    <th className="border px-4 py-2 text-left">Edit</th>
                    <th className="border px-4 py-2 text-left">Delete</th>
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
                          onClick={() => handleEdit(product)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() =>
                            handleDelete(product["id"] || "", index)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={handleAddRow}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Add Row
              </button>

              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Find Best Match
              </button>
            </div>

            {tableError && (
              <div className="bg-red-500 text-white p-4 rounded-md shadow-md">
                <p>{tableError}</p>
              </div>
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
                  onClick={handleModalSave}
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

export default ExtractPurchaseModal;
