import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategoriesOverview } from "../api/category";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategoriesOverview()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error(`Error fetching categories' overview:`, error);
      });
  }, []);

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-3xl mt-28 font-bold mb-8 ml-2 text-center md:flex md:items-center md:justify-start">
        CATEGORIES
        <span className="hidden md:inline-block ml-2 mr-6 flex-grow border-t border-dashed border-gray-400"></span>
      </h2>
      <div className="flex justify-center md:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link to={`/shop?category=${category._id}`} key={category.id}>
              <div className="bg-white flex w-60 md:w-full overflow-hidden transfor transitio duration-300 hover:scale-105 hover:bg-yellow-500 hover:text-white">
                <div className="h- w-1/2 overflow-hidden hidden md:block">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="md:p-6 w-full h-24 text-center relative">
                  <img
                    src={import.meta.env.VITE_API_URL + category.image}
                    alt={category.name}
                    className="object-cover w-full h-full md:hidden"
                  />
                  <div className="md:hidden absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-lg text-white md:text-black  font-normal">
                      {category.name}
                    </h2>
                    <p className="text-sm text-white md:text-gray-500">
                      {category.count}{" "}
                      {category.count === 1 || category.count === 0
                        ? "product"
                        : "products"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
