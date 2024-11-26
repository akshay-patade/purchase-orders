import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

interface ExtractPurchaseModalProps {
  file: File | null;
}

const ExtractPurchaseModal: React.FC<ExtractPurchaseModalProps> = ({
  file,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        //Check if the user has uploaded the file. If not, throw a 400 error code
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

        console.log(res);

        if (!res.ok) {
          throw new Error(
            "Failed to Get the Contents from the data. Please use some other File"
          );
        }

        const result = await res.json();
        const finalData = JSON.stringify(result);
        console.log(finalData);
        setIsLoading(false);
      } catch (err) {
        console.log("error");

        if (err instanceof Error) {
          setError(err.message); // Set the error state
        } else {
          console.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMappings();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      {isLoading ? (
        <Spinner size="large" color="text-red-500" />
      ) : !error ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Content Loaded!</h1>
          <p className="text-lg text-gray-600 mt-2">Here is your content.</p>
        </div>
      ) : (
        <div className="bg-red-500 text-white p-4 rounded-md shadow-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ExtractPurchaseModal;
