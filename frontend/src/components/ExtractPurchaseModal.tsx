import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import {
  ExtractPurchaseOrdersApiResponse,
  ExtractPurchaseOrders,
} from "../schemas/ExtractPurchaseOrdersApiResponseSchema";
import Groq from "groq-sdk";

interface ExtractPurchaseModalProps {
  file: File | null;
  mappingsData: ExtractPurchaseOrdersApiResponse | null;
  setMappingsData: React.Dispatch<
    React.SetStateAction<ExtractPurchaseOrdersApiResponse | null>
  >;
  order_id?: number | null;
}

const ExtractPurchaseModal: React.FC<ExtractPurchaseModalProps> = ({
  file,
  mappingsData,
  setMappingsData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleChange = (
    index: number,
    field: keyof ExtractPurchaseOrders,
    value: string | number
  ) => {
    const updatedMappings: ExtractPurchaseOrdersApiResponse = mappingsData
      ? [...mappingsData]
      : [];

    // Update the specific field
    updatedMappings[index] = {
      ...updatedMappings[index], // Copy existing fields
      [field]: value, // Update the specific field
    };
    // Safely update the field
    updatedMappings[index][field] =
      field === "quantity" || field === "unit_price"
        ? parseFloat(value as string).toString()
        : (value as string);

    // Calculate and update the TOTAL field
    const quantity = parseFloat(updatedMappings[index]["quantity"] || "0");
    const unitPrice = parseFloat(updatedMappings[index]["unit_price"] || "0");
    updatedMappings[index]["total"] = (quantity * unitPrice).toString();

    setMappingsData(updatedMappings);
  };

  const handleAddRow = () => {
    const newRow: ExtractPurchaseOrders = {
      product_description: "",
      quantity: "0",
      unit_price: "0",
      total: "0",
      vendor_number: "",
      item_number: "",
    };

    if (mappingsData) setMappingsData([...mappingsData, newRow]);
  };

  const handleDelete = (index: number) => {
    if (mappingsData) {
      const updatedData = mappingsData.filter((_, i) => i !== index);
      setMappingsData(updatedData);
    }
  };

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        // Check if the user has uploaded the file. If not, throw a 400 error code
        if (!file) {
          throw new Error("Please Upload a file first and then try again");
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          "http://127.0.0.1:8000/api/order/extractOrderDetails/",
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
        setMappingsData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Set the error state
        } else {
          console.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch mappings only if there is no data or it's null
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
        <div className="p-4">
          <div className="overflow-x-auto">
            {mappingsData && mappingsData.length > 0 && (
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Item Number</th>
                    <th className="border px-4 py-2 text-left">
                      product_description
                    </th>
                    <th className="border px-4 py-2 text-left">Quantity</th>
                    <th className="border px-4 py-2 text-left">Unit Price</th>
                    <th className="border px-4 py-2 text-left">Total</th>
                    <th className="border px-4 py-2 text-left">
                      Manufacturer Code
                    </th>
                    <th className="border px-4 py-2 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {mappingsData.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          value={product["product_description"] || ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "product_description",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={product["quantity"] || ""}
                          onChange={(e) =>
                            handleChange(index, "quantity", e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={product["unit_price"] || ""}
                          onChange={(e) =>
                            handleChange(index, "unit_price", e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        {parseFloat(product["total"] || "0").toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          value={product["vendor_number"] || ""}
                          onChange={(e) =>
                            handleChange(index, "vendor_number", e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>

                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(index)}
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

            <div className="flex justify-center gap-2">
              <button
                onClick={handleAddRow}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Add Row
              </button>

              <button
                onClick={handleAddRow}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Match Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractPurchaseModal;
