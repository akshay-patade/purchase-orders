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
      field === "Quantity" || field === "Unit Price"
        ? parseFloat(value as string).toString()
        : (value as string);

    // Calculate and update the TOTAL field
    const quantity = parseFloat(updatedMappings[index]["Quantity"] || "0");
    const unitPrice = parseFloat(updatedMappings[index]["Unit Price"] || "0");
    updatedMappings[index]["TOTAL"] = (quantity * unitPrice).toString();

    setMappingsData(updatedMappings);
  };

  const handleAddRow = () => {
    const newRow: ExtractPurchaseOrders = {
      "Product Description": "",
      Quantity: "0",
      "Unit Price": "0",
      TOTAL: "0",
      "Vendor Number": "",
    };

    if (mappingsData) setMappingsData([...mappingsData, newRow]);
  };

  const handleDelete = (index: number) => {
    if (mappingsData) {
      const updatedData = mappingsData.filter((_, i) => i !== index);
      setMappingsData(updatedData);
    }
  };

  async function convertDataToFormat(
    mappingsData: ExtractPurchaseOrdersApiResponse
  ) {
    try {
      const chatCompletion = await getGroqChatCompletion(mappingsData);
      // Print the completion returned by the LLM.
      let temp: string | null = chatCompletion.choices[0]?.message?.content;
      if (!temp) {
        temp = "";
        setMappingsData(null);
        setError("An unexpected Error occured");
      } else setMappingsData(JSON.parse(temp));

      console.log(temp);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set the error state
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function getGroqChatCompletion(
    mappingsData: ExtractPurchaseOrdersApiResponse
  ) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an advanced language model tasked with reorganising my array of json data based on a defined schema. 
                    This is my stringified array of Json data. ${JSON.stringify(
                      mappingsData
                    )}  - Map the json array keys in the input table to the given schema fields based on
                     their meanings. - If key names are ambiguous, use your best judgment to align them with schema fields.
                      - If any field does not have a value or cannot be calculated, leave it blank.
                       - Return the output in the specified JSON format only, without additional explanations.
                        - Follow the schema definition below: Schema Fields:
                    1. **Product Description**: A description of the product or service.
                    2. **Quantity**: The number of units of the product. If there are any characters or special characters in these fields, please  remove it and give me only the numeric data 
                    3. **Unit Price**: The price per unit of the product.Don't try to leave it blank assuming they will be calculated or provided from an external source. if the data is present then insert it else blank 
                    4. **Total**: The total price of the product (calculated as Quantity multiplied by Unit Price). Don't try to leave it blank assuming they will be calculated or provided from an external source. if the data is present then insert it else blank  
                    5. **Item Number**: A unique code identifying the product, not its description. The item number is not the product description. It will generally be a numeric or a short varchar field
                    6. **Manufacturer Code**: A code provided by the manufacturer or vendor.It will generally be a numeric or a short varchar field`,
        },
        {
          role: "user",
          content:
            "Convert the following data into the array of JSON format based on the schema provided above. Use your best judgment to map ambiguous column names. Just give me the array of json data. Do not give me any explanataion",
        },
      ],
      model: "llama3-8b-8192",
    });
  }

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
          "https://plankton-app-qajlk.ondigitalocean.app/extraction_api",
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
        const data = result["result_data"];
        convertDataToFormat(data);
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
                      Product Description
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
                          value={product["Product Description"] || ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "Product Description",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={product["Quantity"] || ""}
                          onChange={(e) =>
                            handleChange(index, "Quantity", e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={product["Unit Price"] || ""}
                          onChange={(e) =>
                            handleChange(index, "Unit Price", e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        {parseFloat(product["TOTAL"] || "0").toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          value={product["Vendor Number"] || ""}
                          onChange={(e) =>
                            handleChange(index, "Vendor Number", e.target.value)
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
