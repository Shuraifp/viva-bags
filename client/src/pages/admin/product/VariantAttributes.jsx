import React from "react";
import ColorForm from "./ColorForm.jsx";

const VariantAttributes = ({ product, handleInputChange, errors }) => (
  <div className="flex flex-col gap-4">
    <div>
      <label className="block font-semibold">Regular Price:</label>
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

    <div>
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
    </div>

    <div>
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
    </div>

    <div>
      <label className="block font-semibold">Size:</label>
      <select
        value={product.size}
        onChange={(e) => handleInputChange("size", e.target.value)}
        className="border rounded w-full p-2"
      >
        <option value="">Select a Size</option>
        {["S", "M", "L", "XL"].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      {errors.size && (
    <span className="text-red-500 text-sm">{errors.size}</span>
  )}
    </div>
    
    <ColorForm 
    product={product} 
    handleInputChange={handleInputChange}
    errors={errors} />
  </div>
);

export default VariantAttributes;
