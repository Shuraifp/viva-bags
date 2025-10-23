import { useState, useEffect } from "react";
import {
  addCategory,
  editCategoryname,
  toggleCategoryStatus,
  getCategoriesWithFilter,
} from "../../api/category.js";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../components/admin/ConfirmationModal.jsx";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [showAll, setShowAll] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  useEffect(() => {
    getCategoriesWithFilter(showAll? true : false)
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        toast.error("Error fetching categories:", error);
      });
  }, []);

  const handleAddCategory = async () => {
    const trimmedName = newCategory.trim();
    if (!trimmedName) {
      return toast.error("Category name is required.");
    }
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return toast.error("Category name must be between 3 and 30 characters.");
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return toast.error("Category name can only contain letters, numbers, spaces, and hyphens.");
    }
    const duplicate = categories.find(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      return toast.error("This category already exists.");
    }
    try {
      const response = await addCategory(newCategory);
      setCategories([...categories, response]);
      toast.success("Category added successfully!");
      setNewCategory("");
    } catch (error) {
      toast.error("Error adding category:", error.message);
    }
  };

  
  const handleSaveEdit = async () => {
    const trimmedName = editCategoryName.trim();
    if (!trimmedName) {
      return toast.error("Category name is required.");
    }
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return toast.error("Category name must be between 3 and 30 characters.");
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return toast.error("Category name can only contain letters, numbers, spaces, and hyphens.");
    }
    // const normalizeString = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();
    const duplicate = categories.find(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase() && cat._id !== editCategory
    )
    if (duplicate) {
      return toast.error("This category already exists.");
    }
    
      try {
        const response = await editCategoryname(editCategory, editCategoryName);
        setCategories(
          categories.map((cat) =>
            cat._id === editCategory ? { ...cat, name: response.name } : cat
          )
        );
        toast.success("Category updated successfully!");
        setEditCategory(null);
        setEditCategoryName("");
      } catch (error) {
        toast.error( error.response.data.error);
      }
  };

  const handleDeleteCategory = async (cat) => {
    try {
      const response = await toggleCategoryStatus(cat._id, !cat.isDeleted);
      setCategories(
        categories.map((item) =>
          item._id === response._id ? response : item
        )
      );
      if (response.isDeleted)
        toast.success("Category deleted successfully!");
      else toast.success("Category restored successfully!");
    } catch (error) {
      toast.error("Error deleting category:", error);
    }
  };

  const filteredCategories = showAll
    ? categories
    : categories.filter((cat) => !cat.isDeleted);

  return (
    <div className="p-6 bg-gray-100 max-h-[88vh] overflow-y-scroll">
      <ConfirmationModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       onConfirm={() => {
        if (categoryToDelete) handleDeleteCategory(categoryToDelete);
        setIsModalOpen(false);
        setCategoryToDelete(null);
      }}
       message={'Are you sure to delete this ?'}
       buttonText={"Unlist"}
       />
      <h2 className="text-xl font-semibold mb-4">Category Management</h2>
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
            <option value="active">Active Categories</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border border-gray-300 p-3 w-64 mr-2"
          />
          <button
            onClick={handleAddCategory}
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
            <th className="py-2 px-4 bg-gray-600">Category Name</th>
            <th className="py-2 px-4 bg-gray-700">Status</th>
            <th className="py-2 px-4 bg-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cat, index) => (
            <tr
              key={index}
              className={`border-b ${
                cat.isDeleted ? "bg-red-50" : "bg-white"
              }`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">
                {editCategory === cat._id ? (
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
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
                {editCategory === cat._id ? (
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditCategory(cat._id);
                      setEditCategoryName(cat.name)
                    }}
                    className="bg-yellow-700 text-white px-3 py-1 hover:bg-yellow-800 rounded-md"
                    disabled={cat.isDeleted}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!cat.isDeleted) {
                      setCategoryToDelete(cat); 
                      setIsModalOpen(true);
                    } else {
                      handleDeleteCategory(cat);
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

export default CategoryManagement;
