const ColorForm = ({ handleInputChange, product, errors }) => {
  const handleChange = (field, value) => {
    const updatedColor = { ...product.color, [field]: value };
    handleInputChange("color", updatedColor);
  };

  const removeColor = () => {
    handleInputChange("color", {});
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   handleInputChange("color", color);
  // };

  return (
    <form>
      <h3 className="text-xl font-medium my-4">Choose Color</h3>
      <div className="10px">
        <input
          type="text"
          placeholder="Color Name"
          className="border border-gray-300 rounded px-2 py-1 mr-2 mb-3"
          value={product.color.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="color"
          value={product.color.hex || ""}
          className="rounded"
          onChange={(e) => handleChange("hex", e.target.value)}
        />
        <button
          type="button"
          className="ml-5 text-lg bg-red-50 px-3 py-1 rounded-md text-red-500"
          onClick={removeColor}
        >
          Remove
        </button>
        {errors.colorhex && (
          <span className="text-red-500 text-sm">{errors.colorhex}</span>
        )}
        {errors.colorname && (
          <span className="text-red-500 text-sm">{errors.colorname}</span>
        )}
      </div>
    </form>
  );
};

export default ColorForm;
