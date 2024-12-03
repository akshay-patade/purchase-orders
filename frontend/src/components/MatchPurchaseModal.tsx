import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import {
  ExtractPurchaseOrdersApiResponse,
  ExtractPurchaseOrders,
} from "../schemas/ExtractPurchaseOrdersApiResponseSchema";

interface MatchPurchaseModalProps {
  mappingsData: ExtractPurchaseOrdersApiResponse | null;
  setMappingsData: React.Dispatch<
    React.SetStateAction<ExtractPurchaseOrdersApiResponse | null>
  >;
  topMatches?: string[];
}

interface SearchItem {
  id: string;
  score: number;
  description: string;
}

const MatchPurchaseModal: React.FC<MatchPurchaseModalProps> = ({
  mappingsData,
  setMappingsData,
  topMatches = [],
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<ExtractPurchaseOrders | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [originalSearchResults, setOriginalSearchResults] = useState<string[]>(
    []
  );
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleEdit = async (data: ExtractPurchaseOrders, index: number) => {
    setTableError(null);
    setError(null);
    setModalError(null);

    setEditData(data);
    setShowModal(true);

    // Reset search-related states when opening modal
    setSearchQuery("");

    try {
      const getSearchQuery = [data["best_match"]];

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/product/productMatching/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ queries: getSearchQuery }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to Find best Matchings");
      }

      const result = await res.json();
      const searchData = result["queries"][0]["matches"];

      const descriptions: string[] = searchData.map(
        (item: SearchItem) => item.description
      );

      setSearchResults(descriptions);
      setOriginalSearchResults(descriptions);
    } catch (err) {
      if (err instanceof Error) {
        setSearchResults(originalSearchResults);
      } else {
        console.error("An unexpected error occurred");
        setSearchResults(originalSearchResults);
      }
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    setTableError(null);
    setError(null);
    setModalError(null);

    if (!searchQuery.trim()) {
      setSearchResults(originalSearchResults);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/product/search/?query=${searchQuery}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results = await response.json();
      const data = results["suggestions"];
      setSearchResults(data);
    } catch (err) {
      setModalError("Failed to perform search");
      console.error(err);
    }
  };

  // Function to select a best match
  const handleBestMatchSelect = (match: string) => {
    setTableError(null);
    setError(null);
    setModalError(null);

    if (editData) {
      setEditData({
        ...editData,
        best_match: match,
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchResults([]);

    setTableError(null);
    setError(null);
    setModalError(null);
  };

  //Internal function which is used to show the updated data in the frontend
  const handleMappingDataUpdate = () => {
    setTableError(null);
    setError(null);
    setModalError(null);
    if (!mappingsData || !editData || !editData.id) return;

    // Update the mappingsData
    const updatedMappingsData = mappingsData.map((item) =>
      item.id === editData.id ? { ...item, ...editData } : item
    );

    // Update the state
    setMappingsData(updatedMappingsData);
  };

  //This function is invoked when user enters the edit product option and saves the modal
  const handleModalSave = async () => {
    try {
      const orderId = editData?.["id"] || "";
      setTableError(null);
      setError(null);
      setModalError(null);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/order/order-details/${orderId}/`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Something went wrong. Please make sure that you don't process the document whose status is final or please select the different best product matching as compared to previous"
        );
      }

      handleMappingDataUpdate();
      handleCloseModal();
    } catch (err) {
      if (err instanceof Error) {
        setModalError(err.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  //This function is used to change the order status from processed to final
  const handleOrderSave = async () => {
    try {
      setTableError(null);
      setError(null);
      setModalError(null);
      const orderId = mappingsData?.[0]["order_id"] || "";

      const bodyData = { order_id: orderId };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/order/finalize-order/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Something went wrong. Please make sure that you don't submit the document whose status is final "
        );
      }

      alert("Changed the order status from Processed to finalised");
      window.location.href = "/";
    } catch (err) {
      if (err instanceof Error) {
        setTableError(err.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    const fetchbestMappings = async () => {
      try {
        setIsLoading(true);
        setTableError(null);
        setError(null);
        setModalError(null);

        if (!mappingsData || mappingsData.length === 0)
          throw new Error(
            "Failed to find the matching. There should be at least one data in order to perform matching. Please upload the document and try again"
          );
      } catch (err) {
        if (err instanceof Error) {
          setTableError(err.message);
        } else {
          console.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchbestMappings();
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
            {mappingsData && mappingsData.length > 0 && (
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
                        {product["best_match"]}
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

          {tableError && (
            <div className="bg-red-500 mt-4 text-white p-4 rounded-md shadow-md">
              <p>{tableError}</p>
            </div>
          )}

          <button
            className="px-4 py-2 mt-4 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={handleOrderSave}
          >
            Submit the Order
          </button>
        </div>
      )}

      {showModal && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-4 w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Order Details</h2>
            <form className="space-y-4">
              {/* Other form fields remain the same */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Best Product Match
                </label>

                <input
                  type="text"
                  placeholder="Best Product Match"
                  value={editData.best_match || ""}
                  className="w-full px-3 py-2 border rounded flex-grow"
                  readOnly
                />

                {/* Dropdown for top matches or search results */}
                {(searchResults.length > 0 || topMatches.length > 0) && (
                  <select
                    value={editData.best_match || ""}
                    onChange={(e) => handleBestMatchSelect(e.target.value)}
                    className="w-full px-3 py-2 border rounded mt-4"
                  >
                    <option value="">Select Best Match</option>
                    {/* Prioritize search results if available */}
                    {searchResults.length > 0 &&
                      searchResults.map((match, index) => (
                        <option key={`search-${index}`} value={match}>
                          {match}
                        </option>
                      ))}
                  </select>
                )}

                <label className="block text-sm font-medium mt-2">
                  Can't find in the drop down you are looking for? Don't worry
                  we got you covered. Type the query in the search box and hit
                  enter to get relevant details
                </label>

                {/* Search input */}
                <div className="flex space-x-2 mt-4">
                  <input
                    type="text"
                    placeholder="Search best matches"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded flex-grow"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Rest of the form remains the same */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
              {modalError && (
                <div className="bg-red-500 text-white p-4 rounded-md shadow-md">
                  <p>{modalError}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchPurchaseModal;
