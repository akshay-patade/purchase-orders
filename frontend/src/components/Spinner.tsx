import React from "react";

interface SpinnerProps {
  size?: string; // Optional size prop for the spinner (e.g., "small", "medium", "large")
  color?: string; // Optional color for the spinner
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "text-blue-500",
}) => {
  const sizes: Record<string, string> = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex justify-center items-center`}>
      <div
        className={`border-t-transparent border-solid rounded-full animate-spin ${sizes[size]} ${color}`}
      ></div>
    </div>
  );
};

export default Spinner;
