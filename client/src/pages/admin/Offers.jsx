import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getOffers, addOffer, updateOffer, deleteOrRestoreOffer } from "../../api/offer";
import { FaSearch } from "react-icons/fa";
import ApplyOffer from "./ApplyOffer";

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("ascending");
  const [search, setSearch] = useState('');
  const [searchPressed, setSearchPressed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limitPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyingOffer, setApplyingOffer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [offerData, setOfferData] = useState({
    offerName: "",
    offerDescription: "",
    offerType: "",
    offerValue: "",
    maximumDiscount: "",
    validFrom: "",
    validTill: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await getOffers(currentPage, limitPerPage, filter, sort, search);
        setOffers(response.data.offers);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching offers:" + error);
      }
    }

    fetchOffers();
  }, [currentPage, filter, sort, limitPerPage, searchPressed]);

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferData({
      ...offerData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (isEditing) {
        const response = await updateOffer(offerData._id, offerData);
        if (response.status === 200) {
          toast.success(response.data.message);
          setIsModalOpen(false);
          setOffers(offers.map((item) => item._id === offerData._id ? response.data.offer : item));
          setOfferData({
            offerName: "",
            offerDescription: "",
            offerType: "",
            offerValue: "",
            maximumDiscount: "",
            validFrom: "",
            validTill: "",
            isActive: true,
          });
        } else {
          toast.error('Something unexpected occurred!');
        }
        setIsEditing(false);
      } else {
        const response = await addOffer(offerData);
        if (response.status === 201) {
          toast.success(response.data.message);
          setIsModalOpen(false);
          setOffers([...offers, response.data.offer]);
          setOfferData({
            offerName: "",
            offerDescription: "",
            offerType: "",
            offerValue: "",
            maximumDiscount: "",
            validFrom: "",
            validTill: "",
            isActive: true,
          });
        } else {
          toast.error('Something unexpected occurred!');
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
        toast.error('Something unexpected occurred!');
      }
    }
  };

  const handleDeleteAndRestore = async (id) => {
    try {
      const response = await deleteOrRestoreOffer(id);
      if (response.status === 200) {
        toast.success(response.data.message);
        setOffers(offers.map((item) => item._id === id ? response.data.offer : item));
      } else {
        toast.error('Something unexpected occurred!');
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    }
  }

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="p-6 bg-gray-100 h-screen relative">
      <h2 className="text-xl font-semibold mb-4">Offer Management</h2>
      <div className="mb-4 flex justify-between items-start lg:items-center">
        <div className="flex gap-2">
          <div>
            <label className="mr-2 font-medium">Filter:</label>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="border border-gray-300 p-2 py-1 rounded-md"
            >
              <option value="all">All Offers</option>
              <option value="active">Active Offers</option>
              <option value="inactive">Inactive Offers</option>
              <option value="expired">Expired Offers</option>
              <option value='upcoming'>Upcoming Offers</option>
              <option value="percentage">Offer by Percentage</option>
              <option value="fixed">Offer by Fixed</option>
            </select>
          </div>
          <div>
            <label className="mr-2 ml-4 font-medium">Sort:</label>
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
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
            className="lg:px-4 px-3 py-2 lg:py-3 text-nowrap rounded-md text-white bg-gray-600 hover:bg-gray-700">
            Create New
          </button>
          <div className="flex items-center">
            <button
              onClick={() => setSearchPressed(!searchPressed)}
              className="px-4 py-3 text-nowrap text-white bg-gray-600 hover:bg-gray-700">
              <FaSearch />
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by offer code"
              className="border border-gray-300 p-2 ml-1"
            />
          </div>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-white text-left">
            <th className="py-2 pl-4 pr-2 bg-gray-700">SL</th>
            <th className="py-2 px-4 bg-gray-600">Offer Name</th>
            <th className="py-2 pl-4 pr-2 bg-gray-700">Description</th>
            <th className="py-2 pl-4 pr-2 bg-gray-600">Offer Value</th>
            <th className="py-2 px-4 bg-gray-700">Valid From</th>
            <th className="py-2 px-4 bg-gray-600">Valid Until</th>
            <th className="py-2 px-4 bg-gray-700">Status</th>
            <th className="py-2 px-4 bg-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers?.map((item, index) => (
            <tr
              key={index}
              className={`border-b ${
                item.isDeleted ? "bg-red-200" : item.isActive ? item.validFrom > new Date().toISOString() ? "bg-yellow-100" : "bg-white" : item.validTill < new Date().toISOString() ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{item.offerName}</td>
              <td className="py-2 px-4 lg:w-72">{item.offerDescription}</td>
              <td className="py-2 px-4">{item.offerType === "percentage" ? `${item.offerValue}%` : `₹${item.offerValue}`}</td>
              <td className="py-2 px-4">{item.validFrom.split('T')[0]}</td>
              <td className="py-2 px-4">{item.validTill.split('T')[0]}</td>
              <td className="py-2 px-4">{item.isDeleted === true ? "Cancelled" : item.isActive === true ? item.validFrom > new Date().toISOString() ? "Upcoming" : "Active" : item.validTill < new Date().toISOString() ? "Expired" : "Inactive"}</td>
              <td className="py-2 px-4 space-x-2">
                <button
                onClick={() => setApplyingOffer(item)}
                className="text-green-600 hover:underline"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setOfferData({ ...item, validFrom: item.validFrom.split("T")[0], validTill: item.validTill.split("T")[0] });
                    setIsEditing(true);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAndRestore(item._id)}
                  className={`text-${item.isDeleted ? 'green' : 'red'}-500 hover:underline`}
                >
                  {item.isDeleted ? "Restore" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center items-center">
        <div>
          {totalPages > 1 && (
            <ul className="flex items-center gap-3">
              {[...Array(totalPages)].map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageClick(index + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-semibold ${
                      currentPage === index + 1 ? "bg-gray-600 text-white" : "bg-white text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {applyingOffer && <ApplyOffer applyingOffer={applyingOffer} setApplyingOffer={setApplyingOffer} />}
      

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="absolute top-2 bottom-5 left-1/2 -translate-x-1/2 overflow-y-scroll no-scrollbar"><div className=" bg-gray-800 bg-opacity-50  flex justify-center items-center z-50">
      <div className="bg-white shadow-lg p-6 border border-gray-300 md:min-w-[600px] sm:min-w-[500px] lg:min-w-[800px]">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? "Edit Offer" : "Create Offer"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Offer Name
              </label>
              <input
                type="text"
                id="offerName"
                name="offerName"
                value={offerData.offerName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter coupon code"
              />
              {errors.offerName && (
                <span className="text-red-500 text-sm">{errors.offerName}</span>
              )}
            </div >

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="offerDescription"
                value={offerData.offerDescription}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter description"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">{errors.description}</span>
              )}
            </div >

            {/* Discount Type */}
            <div className="mb-4">
              <label htmlFor="offerType" className="block text-sm font-medium text-gray-700">
                Offer Type
              </label>
              <select
                id="offerType"
                name="offerType"
                value={offerData.offerType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select discount type</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
              {errors.offerType && (
                <span className="text-red-500 text-sm">{errors.offerType}</span>
              )}
            </div >

            {/* Discount Value */}
            <div className="mb-4">
              <label htmlFor="offerValue" className="block text-sm font-medium text-gray-700">
                Offer Value
              </label>
              <input
                type="number"
                id="offerValue"
                name="offerValue"
                value={offerData.offerValue}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter discount value"
              />
              {errors.offerValue && (
                <span className="text-red-500 text-sm">{errors.offerValue}</span>
              )}
            </div >


            {/* Maximum Discount */}
            { offerData.offerType === 'percentage' && <div className="mb-4">
              <label htmlFor="maximumDiscount" className="block text-sm font-medium text-gray-700">
                Maximum Discount
              </label>
              <input
                type="number"
                id="maximumDiscount"
                name="maximumDiscount"
                value={offerData.maximumDiscount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter maximum discount (optional)"
              />
              {errors.maximumDiscount && (
                <span className="text-red-500 text-sm">{errors.maximumDiscount}</span>
              )}
            </div>  }

            {/* Valid From */}
            <div className="mb-4">
              <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700">
                Valid From
              </label>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={offerData.validFrom}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.validFrom && (
                <span className="text-red-500 text-sm">{errors.validFrom}</span>
              )}
            </div >

            {/* Valid Till */}
            <div className="mb-4">
              <label htmlFor="validTill" className="block text-sm font-medium text-gray-700">
                Valid Till
              </label>
              <input
                type="date"
                id="validTill"
                name="validTill"
                value={offerData.validTill}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300  p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.validTill && (
                <span className="text-red-500 text-sm">{errors.validTill}</span>
              )}  
            </div >

            {/* Is Active */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={offerData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div >

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setOfferData({
                    offerName: "",
                    offerDescription: "",
                    offerType: "",
                    offerValue: "",
                    maximumDiscount: "",
                    validFrom: "",
                    validTill: "",
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

export default OfferManagement;
