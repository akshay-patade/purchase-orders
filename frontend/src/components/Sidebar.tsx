import React, { useState } from "react";

// Define the type for menu options
type MenuOption =
  | "purchaseOrders"
  | "asnAlerts"
  | "performanceTracking"
  | "materialTracking"
  | "costManagement"
  | "performanceEvaluations"
  | "purchasing"
  | "lineOfCredit"
  | "invoiceMatching";

const Sidebar: React.FC = () => {
  // State to track the selected menu item
  const [selectedMenu, setSelectedMenu] =
    useState<MenuOption>("purchaseOrders");
  const [isOpen, setIsOpen] = useState(true); // State for mobile sidebar toggle

  // Content for each menu item
  const renderContent = () => {
    switch (selectedMenu) {
      case "purchaseOrders":
        return <div>Purchase Orders Content</div>;
      case "asnAlerts":
        return <div>Customer Analytics Content</div>;
      case "performanceTracking":
        return <div>Supplier Performance Content</div>;
      case "materialTracking":
        return <div>Inventory Coverage Content</div>;
      case "costManagement":
        return <div>In-Transit Inventory Content</div>;
      case "performanceEvaluations":
        return <div>Inventory Forecast Content</div>;
      case "purchasing":
        return <div>Purchasing Content</div>;
      case "lineOfCredit":
        return <div>Spend Intelligence Content</div>;
      case "invoiceMatching":
        return <div>Invoice Matching Content</div>;
      default:
        return <div>Purchase Orders Content</div>;
    }
  };

  return (
    <div className="flex">
      {/* Toggle Button for Mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-gray-200 rounded-md shadow-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-100 p-4 min-h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-transform duration-300 w-64 fixed sm:relative`}
      >
        <h2 className={`text-xl font-bold mb-4 ${isOpen} ? "pl-20": pl-0`}>
          Endeavor AI
        </h2>
        <nav>
          <ul className="space-y-3">
            {/* Supply Chain Section */}
            <li className="font-semibold text-gray-600">Supply Chain</li>
            <li
              onClick={() => setSelectedMenu("purchaseOrders")}
              className={`cursor-pointer ${
                selectedMenu === "purchaseOrders"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Purchase Orders
            </li>
            <li
              onClick={() => setSelectedMenu("asnAlerts")}
              className={`cursor-pointer ${
                selectedMenu === "asnAlerts"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Customer Analytics
            </li>
            <li
              onClick={() => setSelectedMenu("performanceTracking")}
              className={`cursor-pointer ${
                selectedMenu === "performanceTracking"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Supplier Performance
            </li>

            <hr className="border-t border-gray-300 my-2" />

            {/* Material Planning Section */}
            <li className="font-semibold text-gray-600 mt-4">
              Material Planning
            </li>
            <li
              onClick={() => setSelectedMenu("materialTracking")}
              className={`cursor-pointer ${
                selectedMenu === "materialTracking"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Inventory Coverage
            </li>
            <li
              onClick={() => setSelectedMenu("costManagement")}
              className={`cursor-pointer ${
                selectedMenu === "costManagement"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              In-Transit Inventory
            </li>
            <li
              onClick={() => setSelectedMenu("performanceEvaluations")}
              className={`cursor-pointer ${
                selectedMenu === "performanceEvaluations"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Inventory Forecast
            </li>

            {/* Finance Section */}
            <li className="font-semibold text-gray-600 mt-4">Finance</li>
            <li
              onClick={() => setSelectedMenu("purchasing")}
              className={`cursor-pointer ${
                selectedMenu === "purchasing"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Purchasing
            </li>
            <li
              onClick={() => setSelectedMenu("lineOfCredit")}
              className={`cursor-pointer ${
                selectedMenu === "lineOfCredit"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Spend Intelligence
            </li>
            <li
              onClick={() => setSelectedMenu("invoiceMatching")}
              className={`cursor-pointer ${
                selectedMenu === "invoiceMatching"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              } pl-4`}
            >
              Invoice Matching
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 bg-white sm:ml-10 ${
          isOpen ? "ml-60" : "ml-0"
        } transition-all duration-300`}
      >
        <div className="p-2">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <div className="text-gray-600">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
