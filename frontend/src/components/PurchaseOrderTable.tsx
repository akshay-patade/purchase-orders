import React from "react";

interface Order {
  id: string;
  date: string;
  status: string;
}

const orders: Order[] = [
  { id: "1730222346350", date: "10/29/2024", status: "Processed" },
  { id: "173022245504", date: "10/29/2024", status: "Processed" },
  { id: "1729776109313", date: "10/24/2024", status: "Processed" },
];

const PurchaseOrderTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Request ID</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Finalized</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border border-gray-300 px-4 py-2">{order.id}</td>
              <td className="border border-gray-300 px-4 py-2">{order.date}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-600">
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderTable;
