import React from "react";

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

interface SidebarProps {
  selectedMenu: MenuOption;
  setSelectedMenu: (menu: MenuOption) => void;
  toggleSidebar: () => void;
  isSidebarVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedMenu,
  setSelectedMenu,
  toggleSidebar,
  isSidebarVisible,
}) => {
  return (
    <nav
      className={`fixed z-30 top-0 left-0 p-3 h-full w-64 bg-gray-800 text-white transform ${
        isSidebarVisible ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-out duration-300 sm:translate-x-0`}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:hidden">
        <h2 className="text-xl font-bold">Endeavor AI</h2>
        <button
          className="text-white bg-gray-600 rounded-md p-2 focus:outline-none"
          onClick={toggleSidebar}
        >
          ✖
        </button>
      </div>

      <ul className="space-y-3 mt-4">
        <li className="hidden sm:block text-xl font-bold">Endeavor AI</li>
        {/* Supply Chain Section */}
        <li className="font-semibold text-gray-400">Supply Chain</li>
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
        <li className="font-semibold text-gray-400 mt-4">Material Planning</li>
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

        <hr className="border-t border-gray-300 my-2" />

        {/* Finance Section */}
        <li className="font-semibold text-gray-400 mt-4">Finance</li>
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
  );
};

export default Sidebar;
