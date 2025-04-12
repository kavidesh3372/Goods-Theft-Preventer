import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { listGoods } from "/src/service/GoodService";

const DashBoard = () => {
  const [goods, setGoods] = useState([]);
  const check = [
    { _id: { date: 2023 }, shopId: 122, status: "Delivered", item: 2000, destination: "Madurai" },
    { _id: { date: 2023 }, shopId: 123, status: "Pending", item: 500, destination: "Chennai" },
    { _id: { date: 2023 }, shopId: 124, status: "Inactive", item: 1000, destination: "Coimbatore" },
  ];

  useEffect(() => {
    getAllGoods();
  }, []);

  const getAllGoods = async () => {
    try {
      const response = await listGoods();
      setGoods(response.data);
    } catch (error) {
      console.log(error);
      setGoods(check);
    }
  };

  
  const statusCounts = goods.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + curr.stockLevel;
    return acc;
  }, {});

  
  const totalItems = Object.values(statusCounts).reduce((sum, value) => sum + value, 0) || 1; 

  
  const gaugeData = [
    { name: "Delivered", value: (statusCounts["Delivered"] || 0) / totalItems * 100, fill: "#4CAF50" },
    { name: "In Transit", value: (statusCounts["In Transit"] || 0) / totalItems * 100, fill: "#2196F3" },
    { name: "In Active", value: (statusCounts["In Active"] || 0) / totalItems * 100, fill: "#FF5722" }
  ];

  return (
    <div className="ml-10 p-5">
      <h3 className="text-xl font-bold mb-5"><i className="fa-solid fa-box"></i> DashBoard</h3>
      <div className="flex mb-10 gap-10">
        {gaugeData.map((data, index) => (
          <div key={index} className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5 w-1/2">
            <h4 className="text-lg font-semibold mb-2">{data.name}</h4>
            <RadialBarChart
              width={250}
              height={250}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={15}
              data={[data]}
            >
              <RadialBar minAngle={15} dataKey="value" background />
              <Tooltip />
              <Legend />
            </RadialBarChart>
            <p className="text-xl font-bold">{data.value.toFixed(2)}%</p>
          </div>
        ))}
      </div>
      <table className="w-full border-collapse border rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="p-3 border">Shop ID</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">StockLevel</th>
            <th className="p-3 border">Destination</th>
          </tr>
        </thead>
        <tbody>
          {goods.map((row) => (
            <tr key={row._id?.toString()} className="text-center bg-white hover:bg-gray-100">
              <td className="p-3 border">{row.shopId}</td>
              <td className={`p-3 border ${row.status === "Delivered" ? "text-green-600" : row.status === "In Active" ? "text-orange-600" : "text-blue-600"}`}>
                <i className={`fa-solid ${row.status === "Delivered" ? "fa-circle-check" : row.status === "In Active" ? "fa-hourglass-half" : "fa-truck"}`}></i> {row.status}
              </td>
              <td className="p-3 border">{row.stockLevel}</td>
              <td className="p-3 border">{row.destination}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoard;
