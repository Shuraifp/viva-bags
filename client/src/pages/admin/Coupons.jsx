import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  addCoupon,
  getCoupons,
  updateCoupon,
  deleteOrRestoreCoupon,
} from "../../api/coupon";
import { FaSearch } from "react-icons/fa";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("ascending");
  const [search, setSearch] = useState("");
  const [searchPressed, setSearchPressed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limitPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [couponData, setCouponData] = useState({
    code: "",
    discountType: "",
    discountValue: "",
    minimumPurchase: "",
    maximumDiscount: "",
    validFrom: "",
    validTill: "",
    usageLimit: 1,
    isActive: true,
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCoupons(
          currentPage,
          limitPerPage,
          filter,
          sort,
          search
        );
        setCoupons(response.data.coupons);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:" + error);
      }
    };

    fetchCoupons();
  }, [currentPage, filter, sort, limitPerPage, searchPressed]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCouponData({
      ...couponData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (isEditing) {
        const response = await updateCoupon(couponData._id, couponData);
        if (response.status === 200) {
          toast.success(response.data.message);
          setIsModalOpen(false);
          setCoupons(
            coupons.map((item) =>
              item._id === couponData._id ? response.data.coupon : item
            )
          );
          setCouponData({
            code: "",
            discountType: "",
            discountValue: "",
            minimumPurchase: "",
            maximumDiscount: "",
            validFrom: "",
            validTill: "",
            usageLimit: 1,
            isActive: true,
          });
        } else {
          toast.error("Something unexpected occured!");
        }
        setIsEditing(false);
      } else {
        const response = await addCoupon(couponData);
        if (response.status === 201) {
          toast.success(response.data.message);
          setIsModalOpen(false);
          setCoupons([...coupons, response.data.coupon]);
          setCouponData({
            code: "",
            discountType: "",
            discountValue: "",
            minimumPurchase: "",
            maximumDiscount: "",
            validFrom: "",
            validTill: "",
            usageLimit: 1,
            isActive: true,
          });
        } else {
          toast.error("Something unexpected occured!");
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      if (err.response.status === 400) {
        if (err.response.data) {
          setErrors(err.response.data);
        }
        if (err.response.data.message) {
          toast.error(err.response.data.message);
        }
      }
      if (err.response.status === 500) {
        toast.error("Something unexpected occured!");
      }
    }
  };

  const handleDeleteAndRestore = async (id) => {
    try {
      const response = await deleteOrRestoreCoupon(id);
      if (response.status === 200) {
        toast.success(response.data.message);
        setCoupons(
          coupons.map((item) => (item._id === id ? response.data.coupon : item))
        );
      } else {
        toast.error("Something unexpected occured!");
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-100 h-screen relative">
      <h2 className="text-xl font-semibold mb-4">Coupon Management</h2>
      <div className="mb-4 flex justify-between items-start lg:items-center">
        <div className="flex gap-2">
          <div>
            <label className="mr-2 font-medium">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 p-2 py-1 rounded-md"
            >
              <option value="all">All Coupon</option>
              <option value="active">Active Coupons</option>
              <option value="inactive">Inactive Coupons</option>
              <option value="expired">Expired Coupons</option>
              <option value="upcoming">Upcoming Coupons</option>
              <option value="percentage">Discount by Percentage</option>
              <option value="fixed">Discount by Fixed</option>
            </select>
          </div>
          <div>
            <label className="mr-2 ml-4 font-medium">Sort:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 p-2 py-1 rounded-md"
            >
              <option value="ascending">Sort by latest</option>
              <option value="descending">Sort by oldest</option>
            </select>
          </div>
        </div>
        <div className="flex items-end flex-col lg:flex-row-reverse gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="lg:px-4 px-3 py-2 lg:py-3 text-nowrap rounded-md text-white bg-gray-600 hover:bg-gray-700"
          >
            Create New
          </button>
          <div className="flex items-center">
            <button
              onClick={() => setSearchPressed(!searchPressed)}
              className="px-4 py-3 text-nowrap text-white bg-gray-600 hover:bg-gray-700"
            >
              <FaSearch />
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by coupon code"
              className="border border-gray-300 p-2 ml-1"
            />
          </div>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-white text-left">
            <th className="py-2 pl-4 pr-2 bg-gray-700">SL</th>
            <th className="py-2 px-4 bg-gray-600">Coupon Code</th>
            <th className="py-2 pl-4 pr-2 bg-gray-700">Discount Value</th>
            <th className="py-2 pl-4 pr-2 bg-gray-600">Usage Limit</th>
            <th className="py-2 px-4 bg-gray-700">Valid From</th>
            <th className="py-2 px-4 bg-gray-600">Valid Until</th>
            <th className="py-2 px-4 bg-gray-700">Status</th>
            <th className="py-2 px-4 bg-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons?.map((item, index) => (
            <tr
              key={index}
              className={`border-b ${
                item.isDeleted
                  ? "bg-red-200"
                  : item.isActive
                  ? item.validFrom > new Date().toISOString()
                    ? "bg-yellow-100"
                    : "bg-white"
                  : item.validTill < new Date().toISOString()
                  ? "bg-red-100"
                  : "bg-gray-100"
              }`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{item.code}</td>
              <td className="py-2 px-4">
                {item.discountType === "percentage"
                  ? `${item.discountValue}%`
                  : `₹${item.discountValue}`}
              </td>
              <td className="py-2 px-4">{item.usageLimit}</td>
              <td className="py-2 px-4">{item.validFrom.split("T")[0]}</td>
              <td className="py-2 px-4">{item.validTill.split("T")[0]}</td>
              <td className="py-2 px-4">
                {item.isDeleted === true
                  ? "Cancelled"
                  : item.isActive === true
                  ? item.validFrom > new Date().toISOString()
                    ? "Upcoming"
                    : "Active"
                  : item.validTill < new Date().toISOString()
                  ? "Expired"
                  : "Inactive"}
              </td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => {
                    setCouponData({
                      ...item,
                      validFrom: item.validFrom.split("T")[0],
                      validTill: item.validTill.split("T")[0],
                    });
                    setIsEditing(true);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAndRestore(item._id)}
                  className={`text-${
                    item.isDeleted ? "green" : "red"
                  }-500 hover:underline`}
                >
                  {item.isDeleted ? "Restore" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center mt-4">
        <nav className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`px-3 py-1 ${
                currentPage === index + 1
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>

      {/*                      Add Modal            */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="absolute top-2 bottom-5 left-1/2 -translate-x-1/2 overflow-y-scroll no-scrollbar">
            <div className=" bg-gray-800 bg-opacity-50  flex justify-center items-center z-50">
              <div className="bg-white shadow-lg p-6 border border-gray-300 md:min-w-[600px] sm:min-w-[500px] lg:min-w-[800px]">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {isEditing ? "Edit Coupon" : "Create New Coupon"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={couponData.code}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter coupon code"
                    />
                    {errors.code && (
                      <span className="text-red-500 text-sm">
                        {errors.code}
                      </span>
                    )}
                  </div>

                  {/* Discount Type */}
                  <div className="mb-4">
                    <label
                      htmlFor="discountType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Discount Type
                    </label>
                    <select
                      id="discountType"
                      name="discountType"
                      value={couponData.discountType}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select discount type</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                    {errors.discountType && (
                      <span className="text-red-500 text-sm">
                        {errors.discountType}
                      </span>
                    )}
                  </div>

                  {/* Discount Value */}
                  <div className="mb-4">
                    <label
                      htmlFor="discountValue"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Discount Value
                    </label>
                    <input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      value={couponData.discountValue}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter discount value"
                    />
                    {errors.discountValue && (
                      <span className="text-red-500 text-sm">
                        {errors.discountValue}
                      </span>
                    )}
                  </div>

                  {/* Minimum Purchase */}
                  <div className="mb-4">
                    <label
                      htmlFor="minimumPurchase"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Minimum Purchase
                    </label>
                    <input
                      type="number"
                      id="minimumPurchase"
                      name="minimumPurchase"
                      value={couponData.minimumPurchase}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter minimum purchase (optional)"
                    />
                    {errors.minimumPurchase && (
                      <span className="text-red-500 text-sm">
                        {errors.minimumPurchase}
                      </span>
                    )}
                  </div>

                  {/* Maximum Discount */}
                  {couponData.discountType === "percentage" && (
                    <div className="mb-4">
                      <label
                        htmlFor="maximumDiscount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Maximum Discount
                      </label>
                      <input
                        type="number"
                        id="maximumDiscount"
                        name="maximumDiscount"
                        value={couponData.maximumDiscount}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter maximum discount (optional)"
                      />
                      {errors.maximumDiscount && (
                        <span className="text-red-500 text-sm">
                          {errors.maximumDiscount}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Valid From */}
                  <div className="mb-4">
                    <label
                      htmlFor="validFrom"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Valid From
                    </label>
                    <input
                      type="date"
                      id="validFrom"
                      name="validFrom"
                      value={couponData.validFrom}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.validFrom && (
                      <span className="text-red-500 text-sm">
                        {errors.validFrom}
                      </span>
                    )}
                  </div>

                  {/* Valid Till */}
                  <div className="mb-4">
                    <label
                      htmlFor="validTill"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Valid Till
                    </label>
                    <input
                      type="date"
                      id="validTill"
                      name="validTill"
                      value={couponData.validTill}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300  p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.validTill && (
                      <span className="text-red-500 text-sm">
                        {errors.validTill}
                      </span>
                    )}
                  </div>

                  {/* Usage Limit */}
                  <div className="mb-4">
                    <label
                      htmlFor="usageLimit"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      id="usageLimit"
                      name="usageLimit"
                      value={couponData.usageLimit}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter usage limit (optional)"
                    />
                    {errors.usageLimit && (
                      <span className="text-red-500 text-sm">
                        {errors.usageLimit}
                      </span>
                    )}
                  </div>

                  {/* Is Active */}
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={couponData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Active
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCouponData({
                          code: "",
                          discountType: "",
                          discountValue: "",
                          minimumPurchase: "",
                          maximumDiscount: "",
                          validFrom: "",
                          validTill: "",
                          usageLimit: 1,
                          isActive: true,
                        });
                        setIsModalOpen(false);
                        setErrors({});
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-600 text-white rounded-sm hover:bg-yellow-700"
                    >
                      {isEditing ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
