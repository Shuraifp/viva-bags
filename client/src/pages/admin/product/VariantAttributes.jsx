import React, { useState } from "react";
import ColorForm from "./ColorForm.jsx";

const VariantAttributes = ({ product, handleInputChange, errors }) => {

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    const updatedVariants = [...product.variants, { size: newSize, stock: "", additionalPrice: "" }];
    handleInputChange("variants", updatedVariants);
  };

  const handleStockChange = (e, index) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index].stock = e.target.value;
    handleInputChange("variants", updatedVariants);
  };
  
  return(
  <div className="flex flex-col gap-4">
    <div>
      <label className="block font-semibold">Price:</label>
      <input
        type="number"
        value={product.regularPrice}
        onChange={(e) => handleInputChange("regularPrice", e.target.value)}
        className="border rounded w-full p-2"
        placeholder="Enter Regular Price"
      />
      {errors.regularPrice && (
    <span className="text-red-500 text-sm">{errors.regularPrice}</span>
  )}
    </div>
   

    <div className="border rounded w-full p-2">
      <label className="block font-semibold mb-2">Variants:</label>
      {product.variants.length < 4 && <select
        value=""
        onChange={handleSizeChange}
        className="border rounded w-full p-2 my-4 appearance-none text-white bg-gray-500 hover:bg-gray-600"
      >
        <option value="" className="bg-white text-gray-500 text-center">Add Variant</option>
        {["S", "M", "L", "XL"].filter((size) => !product.variants.map((variant) => variant.size).includes(size)).map((size) => (
          <option className="bg-white text-gray-500" key={size} value={size}>
            {size}
          </option>
        ))}
      </select>}
    
      {product.variants.length === 0 ? (
        <p className="text-gray-500 text-center mt-1 mb-3">No variants added</p>
      ) : (
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-5 py-2 text-left font-medium">Size</th>
              <th className="px-5 py-2 text-left font-medium">Stock</th>
              <th className="px-5 py-2 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {product.variants.map((variant, index) => (
              <tr key={index} className="bg-gray-100">
                <td className="px-5 py-2">{variant.size}</td>
                <td className="px-5 py-2">
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleStockChange(e, index)}
                    className="border rounded w-full p-2"
                    placeholder="Enter Stock"
                  />
                </td>
                <td className="px-5 py-2">
                  <button
                    onClick={() => {
                      handleInputChange("variants", [
                        ...product.variants.slice(0, index),
                        ...product.variants.slice(index + 1),
                      ])
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    {errors.variants && (
    <span className="text-red-500 text-sm">{errors.variants}</span>
  )}
    
    <ColorForm 
    product={product} 
    handleInputChange={handleInputChange}
    errors={errors} />
  </div>
)
};

export default VariantAttributes;



 {/* <div>
      <label className="block font-semibold">Discounted Price:</label>
      <input
        type="number"
        value={product.discountedPrice}
        onChange={(e) => handleInputChange("discountedPrice", e.target.value)}
        className="border rounded w-full p-2"
        placeholder="Enter Discounted Price"
      />
      {errors.discountedPrice && (
    <span className="text-red-500 text-sm">{errors.discountedPrice}</span>
  )}
    </div> */}

    {/* <div>
      <label className="block font-semibold">Stock:</label>
      <input
        type="number"
        value={product.stock}
        onChange={(e) => handleInputChange("stock", e.target.value)}
        className="border rounded w-full p-2"
        placeholder="Enter Stock Quantity"
      />
      {errors.stock && (
    <span className="text-red-500 text-sm">{errors.stock}</span>
  )}
    </div> */}