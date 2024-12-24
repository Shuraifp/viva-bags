import React, { useState, useEffect } from "react";
import {getCategoriesAndProducts} from "../../api/offer";
import { applyNewOffer, removeOffer } from "../../api/offer";
import toast from "react-hot-toast";

const ApplyOffer = ({ applyingOffer, setApplyingOffer }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoriesToRemove, setCategoriesToRemove] = useState([]);
  const [productsToRemove, setProductsToRemove] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productDropDown, setProductDropDown] = useState(false);
  const [categoryDropDown, setCategoryDropDown] = useState(false);
  const [applyNewDropDown, setApplyNewDropDown] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const response = await getCategoriesAndProducts();
        setCategories(response.data.categories);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching categories and products:" + error);
      }
    }
    fetchCategoriesAndProducts();
  }, []);

  // const getSingleOffer = async () => {
  //   try {
  //     const response = await getOfferById(applyingOffer._id);
  //     setApplyingOffer(response.data.offer);
  //   } catch (error) {
  //     console.error("Error fetching single offer:" + error);
  //   }
  // }

  const applyOffer = async (categories, products) => {
    try {
      const payload = {
        offerId: applyingOffer._id, 
        categories: selectedCategories,
        products : selectedProducts     
      };
  
      const response = await applyNewOffer(payload);
  
      if (response.status === 200) {
        console.log(response.data)
        toast.success(response.data.message);
        setApplyingOffer(response.data.offer);
        setApplyNewDropDown(false);
        setSelectedCategories([]);
        setSelectedProducts([]);
      }
      
    } catch (err) {
      if(err.response) {
        toast.error(err.response.data.message);
      } else {
        console.log(err.message)
      }
    }
  };
  
  const handleRemoveOffer = async () => {
    try {
      const payload = {
        offerId: applyingOffer._id,
        categories: categoriesToRemove,
        products: productsToRemove,
      };
      console.log(payload)
      const response = await removeOffer(payload);
  
      if (response.status === 200) {
        toast.success(response.data.message);
        setApplyingOffer(response.data.offer); 
        setCategoriesToRemove([]); 
        setProductsToRemove([]); 
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        console.error(err.message);
      }
    }
  };
  console.log(categoriesToRemove)
  console.log(categories)
  
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="absolute bg-white top-2 bottom-5 left-1/2 -translate-x-1/2 overflow-y-scroll no-scrollbar">
          <div className=" p-6 md:min-w-[600px] sm:min-w-[500px] lg:min-w-[800px]">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-4">Offer Details</h3>
              <div onClick={() => setApplyingOffer(null)} className="text-center h-fit px-2 cursor-pointer rounded-sm text-white bg-gray-400">X</div>
            </div>
            <div>
              <p className="mb-2"><span className="text-gray-600 font-semibold">Offer Name:</span> {applyingOffer.offerName}</p>
              <div className="my-4 flex flex-col border-b border-gray-300">
                <p onClick={() => {
                  setApplyNewDropDown(false); 
                  setProductDropDown(!productDropDown);
                  setCategoryDropDown(false);
                }} className="mb-2 font-semibold text-gray-600 text-center py-2 bg-gradient-to-b from-gray-100 to-gray-200 cursor-pointer hover:from-gray-200 hover:to-gray-300">AAPLIED PRODUCTS</p>
                { productDropDown && <div>
                  <ul className="list-disc">
                    {applyingOffer.products.length ? applyingOffer.products.map((product, index) => (
                      <li key={index} 
                      onClick={() => {
                        if (!productsToRemove.includes(product._id)) {
                          setProductsToRemove([...productsToRemove, product._id]);
                        } else {
                          setProductsToRemove(productsToRemove.filter((id) => id !== product._id));
                        }
                      }} 
                      className="py-2 px-4 bg-gray-100 my-1 flex justify-between hover:bg-gray-200 border-gray-500">{product.name}<input type="checkbox" checked={productsToRemove.includes(product._id)} className="mr-2" /></li>
                    )) : <p className="my-3 text-center text-gray-400">No products applied</p>}
                  </ul>
                  { productsToRemove.length ===0 ? <button onClick={() => setApplyNewDropDown(!applyNewDropDown)} className="mt-3 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">{applyNewDropDown ? "Close" : "Apply New"}</button>
                  : <button onClick={handleRemoveOffer} className="mt-3 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Remove Offer</button>}
                  { applyNewDropDown && <div className="flex flex-col bg-white">
                    <ul>
                      {products.length ? products.map((product, index) => (
                        <li key={index} 
                        onClick={() => {
                          if (!selectedProducts.includes(product._id)) {
                            setSelectedProducts([...selectedProducts, product._id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter((id) => id !== product._id));
                          }
                        }} 
                        className="py-2 px-4 bg-gray-100 my-1 flex justify-between hover:bg-gray-200 border-gray-500">{product.name}<input type="checkbox" checked={selectedProducts.includes(product._id)} className="mr-2" /></li>
                      )) : <p className="my-3 text-center text-gray-400">No products available</p>}
                    </ul>
                  </div>}
                  { applyNewDropDown && <button onClick={applyOffer} className="block w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Apply</button>}
                </div>}
              </div>
              <div className="my-4 pb-3 flex flex-col border-b border-gray-300">
                <p onClick={() => {
                  setApplyNewDropDown(false);
                  setCategoryDropDown(!categoryDropDown)
                  setProductDropDown(false);
                }} className="mb-2 font-semibold text-gray-600 text-center py-2 bg-gradient-to-b from-gray-100 to-gray-200 cursor-pointer hover:from-gray-200 hover:to-gray-300">APPLIED CATEGORIES</p>
                { categoryDropDown && <div>
                  <ul>
                    {applyingOffer.categories.length ? applyingOffer.categories.map((category, index) => (
                      <li key={index} 
                      onClick={() => {
                        if (!categoriesToRemove.includes(category._id)) {
                          setCategoriesToRemove([...categoriesToRemove, category._id]);
                        } else {
                          setCategoriesToRemove(categoriesToRemove.filter((id) => id !== category._id));
                        }
                      }}
                      className="py-2 px-4 bg-gray-100 my-1 flex justify-between hover:bg-gray-200 border-gray-500">{category.name}<input type="checkbox"  checked={categoriesToRemove.includes(category._id)} className="mr-2" /></li>
                    )) : <p className="my-3 text-center text-gray-400">No categories applied</p>}
                  </ul>
                  { categoriesToRemove.length ===0 ? <button onClick={() => setApplyNewDropDown(!applyNewDropDown)} className="mt-3 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">{applyNewDropDown ? "Close" : "Apply New"}</button>
                  : <button onClick={handleRemoveOffer} className="mt-3 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Remove Offer</button>}
                  { applyNewDropDown && <div className="flex flex-col bg-white">
                    <ul>
                      {categories.length ? categories.map((category, index) => (
                        <li key={index} 
                        onClick={() => {
                          if (!selectedCategories.includes(category._id)) {
                            setSelectedCategories([...selectedCategories, category._id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter((id) => id !== category._id));
                          }
                        }} 
                        className="py-2 px-4 bg-gray-100 my-1 flex justify-between hover:bg-gray-200 border-gray-500">{category.name}<input type="checkbox" checked={selectedCategories.includes(category._id)} className="mr-2" /></li>
                      )) : <p className="my-3 text-center text-gray-400">No categories available</p>}
                    </ul>
                  </div>}
                  { applyNewDropDown && <button onClick={applyOffer} className="block w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Apply</button>}
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ApplyOffer;
