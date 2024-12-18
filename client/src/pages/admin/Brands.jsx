import React, { useState, useEffect } from "react";
import {
  addBrand,
  editBrandname,
  toggleBrandStatus,
  getBrandsWithFilter,
} from "../../api/brand.js";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../components/admin/ConfirmationModal.jsx";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [editBrand, setEditBrand] = useState(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [showAll, setShowAll] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null)
  const [productToRestore, setProductToRestore] = useState(null)

  useEffect(() => {
    getBrandsWithFilter(showAll? true : false)
      .then((data) => {
        setBrands(data);
      })
      .catch((error) => {
        toast.error("Error fetching categories:", error);
      });
  }, []);

  const handleAddBrand = async () => {
    const trimmedName = newBrand.trim();
    if (!trimmedName) {
      return toast.error("Brand name is required.");
    }
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return toast.error("Brand name must be between 3 and 30 characters.");
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return toast.error("Brand name can only contain letters, numbers, spaces, and hyphens.");
    }
    const duplicate = brands.find(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      return toast.error("This brand already exists.");
    }
    try {
      const response = await addBrand(newBrand);
      setBrands([...brands, response]);
      toast.success("Brand added successfully!");
      setNewBrand("");
    } catch (error) {
      toast.error("Error adding Brand:", error.message);
    }
  };

  
  const handleSaveEdit = async () => {
    const trimmedName = editBrandName.trim();
    if (!trimmedName) {
      return toast.error("Brand name is required.");
    }
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return toast.error("Brand name must be between 3 and 30 characters.");
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return toast.error("Brand name can only contain letters, numbers, spaces, and hyphens.");
    }
    const duplicate = brands.find(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase() && cat._id !== editBrand
    )
    if (duplicate) {
      return toast.error("This brand already exists.");
    }
    
      try {
        const response = await editBrandname(editBrand, editBrandName);
        setBrands(
          brands.map((cat) =>
            cat._id === editBrand ? { ...cat, name: response.name } : cat
          )
        );
        toast.success("Brand updated successfully!");
        setEditBrand(null);
        setEditBrandName("");
      } catch (error) {
        toast.error( error.response.data.error);
      }
  };

  const handleDeleteBrand = async (cat) => {
    try {
      const response = await toggleBrandStatus(cat._id, !cat.isDeleted);
      setBrands(
        brands.map((item) =>
          item._id === response._id ? response : item
        )
      );
      if (response.isDeleted)
        toast.success("Brand deleted successfully!");
      else toast.success("Brand restored successfully!");
    } catch (error) {
      toast.error("Error deleting brand:", error);
    }
  };

  const filteredBrands = showAll
    ? brands
    : brands.filter((cat) => !cat.isDeleted);

  return (
    <div className="p-6 bg-gray-100 max-h-[88vh] overflow-y-scroll">
      <ConfirmationModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       onConfirm={() => {
        if (productToDelete) handleDeleteBrand(productToDelete);
        if (productToRestore) handleDeleteBrand(productToRestore);
        setIsModalOpen(false);
        setProductToRestore(null);
        setProductToDelete(null);
      }}
       message={`Are you sure  you want to ${productToDelete ? "delete" : "restore"} this Brand ?`}
       buttonText={productToDelete ? "Delete" : "Restore"}
       />
      <h2 className="text-xl font-semibold mb-4">Brand Management</h2>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2 font-medium">Filter:</label>
          <select
            value={showAll ? "all" : "active"}
            onChange={(e) =>
              setShowAll(e.target.value === "all")
            }
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="all">Show All</option>
            <option value="active">Active brands</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Add new brand"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            className="border border-gray-300 p-3 w-64 mr-2"
          />
          <button
            onClick={handleAddBrand}
            className="bg-slate-700 text-white px-5 py-3 rounded-md"
          >
            Add New
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-white text-left">
            <th className="py-2 px-4 bg-gray-700">SL</th>
            <th className="py-2 px-4 bg-gray-600">Brand Name</th>
            <th className="py-2 px-4 bg-gray-700">Status</th>
            <th className="py-2 px-4 bg-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBrands.map((cat, index) => (
            <tr
              key={index}
              className={`border-b ${
                cat.isDeleted ? "bg-red-50" : "bg-white"
              }`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">
                {editBrand === cat._id ? (
                  <input
                    type="text"
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                    className="border border-gray-300 rounded-lg p-1"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="py-2 px-4">
                <span
                  className={`px-3 py-1 rounded-md ${
                    cat.isDeleted ? "bg-red-200" : "bg-green-200"
                  }`}
                >
                  {cat.isDeleted ? "Deleted" : "Active"}
                </span>
              </td>
              <td className="py-2 px-4 space-x-2">
                {editBrand === cat._id ? (
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditBrand(cat._id);
                      setEditBrandName(cat.name)
                    }}
                    className="bg-yellow-700 text-white px-3 py-1 hover:bg-yellow-800 rounded-md"
                    disabled={cat.isDeleted}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    if (cat.isDeleted) {
                      setProductToRestore(cat);
                      setIsModalOpen(true);
                    } else {
                      setProductToDelete(cat);
                      setIsModalOpen(true);
                    }
                  }}
                  className={`px-3 py-1 rounded-md ${
                    cat.isDeleted
                      ? "bg-blue-900 text-white"
                      : "bg-red-800 text-white"
                  }`}
                >
                  {cat.isDeleted ? "Restore" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandManagement;
