
const GeneralAttributes = ({ product, errors, categories, handleInputChange, brands }) => (
  <div className="flex flex-col gap-4">
    <div>
      <label className="block font-semibold">Product Name:</label>
      <input
        type="text"
        value={product.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="border rounded w-full p-2"
        placeholder="Enter Product Name"
      />
      {errors.productName && (
    <span className="text-red-500 text-sm">{errors.productName}</span>
  )}
    </div>

    <div>
      <label className="block font-semibold">Description:</label>
      <textarea
        value={product.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        className="border rounded w-full p-2"
        placeholder="Enter Product Description"
      />
      {errors.description && (
    <span className="text-red-500 text-sm">{errors.description}</span>
  )}
    </div>

    <div>
      <label className="block font-semibold">Category:</label>
      <select
        value={product.category}
        onChange={(e) => handleInputChange("category", e.target.value)}
        className="border rounded w-full p-2"
      >
        <option value="">Select a Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      {errors.category && (
    <span className="text-red-500 text-sm">{errors.category}</span>
  )}
    </div>
    
    
    <div>
      <label className="block font-semibold">Brand:</label>
      <select
        value={product.brand}
        onChange={(e) => handleInputChange("brand", e.target.value)}
        className="border rounded w-full p-2"
      >
        <option value="">Select a Brand</option>
        {brands.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      {errors.brand && (
    <span className="text-red-500 text-sm">{errors.brand}</span>
  )}
    </div>
  </div>
);

export default GeneralAttributes;
