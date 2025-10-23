import { useState } from "react";
import { toast } from "react-hot-toast";
import { generateSalesReport, downloadSalesReport } from "../../api/sales";

const SalesReport = () => {
  const [filter, setFilter] = useState("daily");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = async () => {
    try {
      const response = await generateSalesReport(filter, customDateRange);
      setReportData(response.data);
      toast.success("Sales report generated successfully!");
    } catch (error) {
      console.log(error)
      toast.error("Error generating sales report.");
    }
  };

  // useEffect(() => {
  //   handleGenerateReport();
  // }, [filter, customDateRange]);
  

  const handleDownloadReport = async (format) => {
    try {
      const response = await downloadSalesReport(format,filter, customDateRange);
      const blob = new Blob([response.data], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Sales_Report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      link.click();
      toast.success(`${format.toUpperCase()} report downloaded!`);
    } catch (error) {
      toast.error(`Error downloading ${format} report.`);
    }
  };
console.log(reportData)
  return (
    <div className="p-6 bg-gray-100 h-screen relative overflow-y-scroll no-scrollbar">
      <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
      <div className="mb-4 flex justify-between items-start lg:items-center">
        <div className="flex gap-2">
          <div>
            <label className="mr-2 font-medium">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 p-2 py-1 rounded-md"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          {filter === "custom" && (
            <div>
              <label className="mr-2 ml-4 font-medium">Start Date:</label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                className="border border-gray-300 p-2 py-1 rounded-md"
              />
              <label className="mr-2 ml-4 font-medium">End Date:</label>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                className="border border-gray-300 p-2 py-1 rounded-md"
              />
            </div>
          )}
        </div>
        <button
          onClick={handleGenerateReport}
          className="lg:px-4 px-3 py-2 lg:py-3 text-nowrap rounded-sm text-white bg-gray-600 hover:bg-gray-700">
          Generate Sales Report
        </button>
      </div>
      {reportData && (
        <div className="report-section p-4 bg-white rounded-sm shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-500">Sales Overview</h3>
          <ul className="pl-5 py-5">
            <li className="mb-2 flex justify-between border-b border-gray-200 pb-2"><strong>Overall Sales Count:</strong> <p>{reportData.salesCount}</p></li>
            <li className="mb-2 flex justify-between border-b border-gray-200 pb-2"><strong>Overall Order Amount:</strong> <p>₹{reportData.orderAmount}</p></li>
            <li className="mb-2 flex justify-between border-b border-gray-200 pb-2"><strong>Overall Discount:</strong> <p>₹{reportData.totalDiscount}</p></li>
            <li className="mb-2 flex justify-between border-b border-gray-200 pb-2"><strong>Coupons Deduction:</strong> <p>₹{reportData.couponsDeduction}</p></li>
            <li className="mb-2 flex justify-between text-xl text-green-600 border-b border-gray-200 pb-2"><strong>Net Sales:</strong> <p>₹{(reportData.orderAmount - reportData.totalDiscount).toFixed(2)}</p></li>
          </ul>
          <div className="mt-2 flex gap-1 justify-end font-normal items-end text-sm">
            <button
              onClick={() => handleDownloadReport("pdf")}
              className="text-blue-500 hover:underline"
            >
              Download PDF
            </button>
            <p className="text-gray-400 text-xl">|</p>
            <button
              onClick={() => handleDownloadReport("excel")}
              className="text-blue-500 hover:underline"
            >
              Download Excel
            </button>
          </div>
        </div>
      )}
      <table className="min-w-full bg-white shadow-md rounded-sm mt-4">
        <thead>
          <tr className="text-white text-left">
            <th className="py-2 px-4 bg-gray-700">Order ID</th>
            <th className="py-2 px-4 bg-gray-600">Order Date</th>
            <th className="py-2 px-4 bg-gray-700">Product Count</th>
            <th className="py-2 px-4 bg-gray-600">Order Amount</th>
            <th className="py-2 px-4 bg-gray-700">Discount</th>
            <th className="py-2 px-4 bg-gray-600">Net Amount</th>
          </tr>
        </thead>
        <tbody>
          {reportData && reportData.reportData.map((order, index) => (
            <tr
              key={index}
              className={`border-b bg-white`}
            >
              <td className="py-2 px-4">{order.orderNumber}</td>
              <td className="py-2 px-4">{order.createdAt.slice(0, 10)}</td>
              <td className="py-2 px-4">{order.products.filter(product => product.status === 'Delivered').reduce((total, product) => total + product.quantity, 0)}</td>
              <td className="py-2 px-4">₹{order.products.filter(product => product.status === 'Delivered').reduce((total, product) => total + product.price + product.discount, 0) + order.shippingCost}</td>
              <td className="py-2 px-4 space-x-2">{order.products.filter(product => product.status === 'Delivered').reduce((total, product) => total + (product.discount * product.quantity), 0)
               + (order.coupon ? order.coupon.discountType === 'percentage'? 
                  order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue : 0)}
              </td>
              <td className="py-2 px-4">₹{order.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;
