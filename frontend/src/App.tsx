import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import PurchaseOrder from "./pages/PurchaseOrder";

function App() {
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

  const renderContent = () => {
    switch (selectedMenu) {
      case "purchaseOrders":
        return <PurchaseOrder />;
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
        return <PurchaseOrder />;
    }
  };

  // State to track the selected menu item
  const [selectedMenu, setSelectedMenu] =
    useState<MenuOption>("purchaseOrders");

  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // State for mobile sidebar toggle

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="flex min-h-screen">
      <button
        className="sm:hidden w-7 bg-gray-800 text-white rounded-md focus:outline-none"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <Sidebar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        toggleSidebar={toggleSidebar}
        isSidebarVisible={isSidebarVisible}
      />

      <div className="flex-1 p-5 sm:ml-64">{renderContent()}</div>
    </div>
  );
}

export default App;
