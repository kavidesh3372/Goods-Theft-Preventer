import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listInventory } from "/src/service/InventoryService";
import { fetchAllRfids, updateRfidStatus } from "/src/service/RfidService";
import { TbArrowsExchange } from "react-icons/tb";

// 📌 Inventory Table Component
const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getInventory();
    const interval = setInterval(getInventory, 5000);
    return () => clearInterval(interval);
  }, []);

  const getInventory = async () => {
    try {
      const response = await listInventory();
      setInventory(response.data);
    } catch (error) {
      console.log(error);
      setInventory([]);
    }
  };

  function handleTransfer() {
    navigate("/transaction"); // Navigating to Transaction Page
  }

  return (
    <div className="ml-10 p-5">
      <h3 className="text-xl font-bold mb-5">Inventory</h3>
      <table className="w-full border-collapse border rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="p-3 border">Stock ID</th>
            <th className="p-3 border">Commodity</th>
            <th className="p-3 border">Stock Level</th>
            <th className="p-3 border">Process</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.stockId} className="text-center bg-white hover:bg-gray-100">
              <td className="p-3 border">{item.stockId}</td>
              <td className="p-3 border">{item.commodity}</td>
              <td className="p-3 border">{item.stockLevel}</td>
              <td className="p-3 border">
                <button onClick={handleTransfer} className="hover:border border-gray-600 rounded-lg p-2">
                  <TbArrowsExchange size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 📌 RFID Table Component with Expiry Check & Backend Update
const RfidTable = () => {
  const [rfidData, setRfidData] = useState([]);

  // Format Date
  const normalFormatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  // Expiry Check Function
  const isExpired = (expiringDate) => {
    return new Date(expiringDate) < new Date();
  };

  useEffect(() => {
    getRfidData();
    const interval = setInterval(getRfidData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRfidData = async () => {
    try {
      const response = await fetchAllRfids();
      const updatedData = response.data.map((item) => {
        if (isExpired(item.expiringDate) && item.status !== "Expired") {
          updateStatusInBackend(item.uid); // Call API to update backend
          return { ...item, status: "Expired" };
        }
        return item;
      });

      setRfidData(updatedData);
    } catch (error) {
      console.log(error);
      setRfidData([]);
    }
  };

  
  const updateStatusInBackend = async (uid) => {
    try {
      await updateRfidStatus(uid, "Expired"); // Call API to update status
      console.log(`Status updated to Expired for UID: ${uid}`);
    } catch (error) {
      console.log(`Error updating status for UID: ${uid}`, error);
    }
  };

  return (
    <div className="ml-10 p-5">
      <h3 className="text-xl font-bold mb-5"><i className="fa-solid fa-tags"></i> RFID Data</h3>
      <table className="w-full border-collapse border rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="p-3 border">UID</th>
            <th className="p-3 border">Commodity</th>
            <th className="p-3 border">Manufacturing Date</th>
            <th className="p-3 border">Expiring Date</th>
            <th className="p-3 border">Destination</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">HashCode</th>
          </tr>
        </thead>
        <tbody>
          {rfidData.map((item) => (
            <tr key={item.uid} className="text-center bg-white hover:bg-gray-100">
              <td className="p-3 border">{item.uid}</td>
              <td className="p-3 border">{item.commodity}</td>
              <td className="p-3 border">{normalFormatDate(item.manufacturingDate)}</td>
              <td className="p-3 border">{normalFormatDate(item.expiringDate)}</td>
              <td className="p-3 border">{item.destination}</td>
              <td className={`p-3 border ${isExpired(item.expiringDate) ? "text-red-600" : ""} ${item.status=== "Available" ? "text-green-600" : "text-blue-600"}`}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 📌 Combined Component
const CombinedComponent = () => {
  return (
    <div>
      <InventoryTable />
      <RfidTable />
    </div>
  );
};

export default CombinedComponent;
