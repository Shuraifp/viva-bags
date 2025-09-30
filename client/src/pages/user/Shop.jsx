import { useState, useEffect, useCallback } from "react";
import {  getSortedProducts } from "../../api/products";
import { Link, useLocation } from "react-router-dom";
import FilterOptions from "../../components/FilterOptions";
import ProductCard from "../../components/ProductsCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Pagination from "../../components/Pagination";
import { FaTh } from "react-icons/fa";
import toast from "react-hot-toast";

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const searchCategory = searchParams.get("category") || "";
  const limitPerPage = 9;
  const [filters, setFilters] = useState({
    price: [],
    color: [],
    size: [],
  });

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getSortedProducts(
        currentPage,
        limitPerPage,
        sort,
        searchQuery,
        searchCategory,
        filters
      );
      setProducts(response.data.productsData || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
      else toast.error(error.message);
    }
  }, [currentPage, sort, searchQuery, searchCategory, filters, limitPerPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort, searchQuery, searchCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, sort, searchQuery, searchCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-100">
      <Navbar />

      <div className="m-8 mt-6 mb-2 px-4 py-3 bg-white">
        <nav className="text-gray-500 text-lg">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          /
          <Link to="/shop" className="hover:underline">
            {" "}
            Shop
          </Link>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 m-8">
        <FilterOptions setFilters={setFilters} />

        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link to="/shop">
                <button className="border rounded p-2 mr-2 bg-white hover:bg-gray-100">
                  <FaTh className="text-gray-500 hover:text-black" />
                </button>
              </Link>
            </div>
            <div>
              <select
                value={sort}
                className="border rounded p-2 outline-none"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value={"average_rating"}>Sort by average rating</option>
                <option value="latest">Sort by latest</option>
                <option value="price_low_high">
                  Sort by price: low to high
                </option>
                <option value="price_high_low">
                  Sort by price: high to low
                </option>
                <option value={"a_to_z"}>aA - zZ</option>
                <option value={"z_to_a"}>zZ - aA</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              // filteredProducts?.map((product) => (
              //   product.category.name === category ? (<ProductCard key={product._id} product={product} /> ): null
              // )) :
              products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            }
          </div>
        </main>
      </div>
      <Pagination totalPages={totalPages} onPageChange={handlePageChange} currentPage={currentPage} />
      <Footer />
    </div>
  );
};

export default Shop;
