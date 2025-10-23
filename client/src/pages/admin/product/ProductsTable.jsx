import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchProducts, toggleProductStatus } from "../../../api/products";
import { getCategories } from "../../../api/category";
import ConfirmationModal from "../../../components/admin/ConfirmationModal";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAll] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null)
  const [productToRestore, setProductToRestore] = useState(null)
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (error) {
        toast.error("Error fetching categories:", error);
      }
    };
    fetchCategories();

    const getProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      } catch (error) {
        toast.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  const handleDeleteProduct = async (prod) => {
    try {
      const response = await toggleProductStatus(prod._id);
      setProducts(
        products.map((item) =>
          item._id === response._id ? response : item
        )
      );
      if (!response.islisted)
        toast.success("Product deleted successfully!");
      else toast.success("Product restored successfully!");
    } catch (error) {
      toast.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products?.filter((prod) =>
    (showAll || prod.islisted) &&
    (selectedCategory ? prod.category._id === selectedCategory : true) &&
    (selectedStatus ? (selectedStatus === "active" ? prod.islisted : !prod.islisted) : true)
  );

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  return (
    // <div className="pb-12">
    <div className="p-6 bg-gray-100 max-h-[88vh] overflow-y-scroll">
      <ConfirmationModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       onConfirm={() => {
        if (productToDelete) handleDeleteProduct(productToDelete);
        if (productToRestore) handleDeleteProduct(productToRestore);
        setIsModalOpen(false);
        setProductToRestore(null);
        setProductToDelete(null);
      }}
       message={`Are you sure  you want to ${productToDelete ? "delete" : "restore"} this ?`}
       buttonText={productToDelete ? "Delete" : "Restore"}
       />
      <h2 className="text-xl font-semibold mb-4">Product Management</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <label className="mr-2 font-medium">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)} 
              className="border border-gray-200 p-2"
            >
              <option value="">All items</option>
              <option value="active">Active items</option>
              <option value="deleted">Unlisted items</option> 
            </select>
          </div>

          <div>
            <label className="mr-2 font-medium">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-200 p-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-slate-700 text-white px-5 py-3 rounded-md"
        >
          Add New Product
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-white text-left">
            <th className="py-2 px-4 bg-gray-700">SL</th>
            <th className="py-2 px-4 bg-gray-600">Image</th> 
            <th className="py-2 px-4 bg-gray-700">Product Name</th>
            <th className="py-2 px-4 bg-gray-600">Category</th>
            <th className="py-2 px-4 bg-gray-700">Stocks</th>
            <th className="py-2 px-4 bg-gray-600">Status</th>
            <th className="py-2 px-4 bg-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((prod, index) => (
            <tr
              key={prod._id}
              className={`border-b ${prod.islisted ? prod.stock>0? "bg-white" : "bg-yellow-100" : "bg-red-50"}`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">
              
                  <img
                    src={`${ prod?.images[0]?.url }`}
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                
              </td> 
              <td className="py-2 px-4">{prod.name}</td>
              <td className="py-2 px-4">{prod.category.name}</td>
              <td className="py-2 px-4">
                {prod.variants.map((variant) => (
                  <p key={variant._id} className={` my-1 ${variant.stock > 15 ? "text-green-500" : "text-red-500"} bg-gray-100 px-2 rounded flex justify-between`}><span>{variant.size}:</span><span className="font-semibold">{variant.stock}</span></p>
                ))}
              </td>
              <td className="py-2 px-4">
                <span
                  className={`px-3 py-1 rounded-md ${prod.islisted && prod.stock >0 ? "bg-green-200" : "bg-red-200"}`}
                >
                  {prod.islisted ? prod.stock>0 ? "Active" : "Out of Stock" : "UnListed"}
                </span>
              </td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => navigate(`/admin/products/edit/${prod._id}`)}
                  className="bg-yellow-700 text-white px-3 py-1 rounded-md"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    if(prod.islisted){
                      setIsModalOpen(true);
                      setProductToDelete(prod);
                    } else {
                      setProductToRestore(prod);
                      setIsModalOpen(true);
                    }
                  }}
                  className={`px-3 py-1 rounded-md ${
                    prod.islisted ? "bg-red-800 text-white" : "bg-blue-900 text-white"
                  }`}
                >
                  {prod.islisted ? "Delete" : "Restore"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    //   {/* Pagination */}
    //   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center mt-4">
    //     <nav className="flex space-x-2">
    //       {Array.from({ length: totalPages }, (_, index) => (
    //         <button
    //           key={index}
    //           onClick={() => handlePageClick(index + 1)}
    //           className={`px-3 py-1 ${
    //             currentPage === index + 1
    //               ? "bg-gray-600 text-white"
    //               : "bg-gray-200 hover:bg-gray-300"
    //           }`}
    //         >
    //           {index + 1}
    //         </button>
    //       ))}
    //     </nav>
    //   </div>
    // </div>
  );
};

export default ProductManagement;
