import React, { useState } from 'react';

const FilterOptions = ({ onFilterChange }) => {
  
  const [filters, setFilters] = useState({
    price: [],
    color: [],
    size: [],
  });

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];

      const updatedFilters = { ...prevFilters, [filterType]: updatedFilter };
      onFilterChange(updatedFilters); 
      return updatedFilters;
    });
  };
  return (
    <aside className="md:col-span-1 text-gray-500">
      {/* Filter by Price */}
      <h3 className="text-xl font-bold mb-2">FILTER BY PRICE</h3>
      <div className="mb-6 bg-white p-3">
        <ul className="space-y-2">
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  onChange={() => handleCheckboxChange('price', 'all')}
                />
                All Price
              </div>
              (50)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  onChange={() => handleCheckboxChange('price', '10000-40000')}
                />
                10000 - 40000
              </div>
              (50)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedPrice.includes('1000-10000')}
                  onChange={() => handleCheckboxChange('price', '1000-10000')}
                />
                1000 - 10000
              </div>
              (50)
            </label>
          </li>
          
        </ul>
      </div>

      {/* Filter by Color */}
      <h3 className="text-xl font-bold mb-2">FILTER BY COLOR</h3>
      <div className="mb-6 p-3 bg-white">
        <ul className="space-y-2">
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedColor.includes('all')}
                  onChange={() => handleCheckboxChange('color', 'all')}
                />
                All Color
              </div>
              (550)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedColor.includes('black')}
                  onChange={() => handleCheckboxChange('color', 'black')}
                />
                Black
              </div>
              (334)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedColor.includes('black')}
                  onChange={() => handleCheckboxChange('color', 'gray')}
                />
                Gray
              </div>
              (124)
            </label>
          </li>
          
        </ul>
      </div>

      {/* Filter by Size */}
      <h3 className="text-xl font-bold mb-2">FILTER BY SIZE</h3>
      <div className="mb-6 p-3 bg-white">
        <ul className="space-y-2">
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedSize.includes('all')}
                  onChange={() => handleCheckboxChange('size', 'all')}
                />
                All Size
              </div>
              (550)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedSize.includes('S')}
                  onChange={() => handleCheckboxChange('size', 'S')}
                />
                Small (S)
              </div>
              (120)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedSize.includes('S')}
                  onChange={() => handleCheckboxChange('size', 'M')}
                />
                Medium (M)
              </div>
              (100)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedSize.includes('S')}
                  onChange={() => handleCheckboxChange('size', 'L')}
                />
                Large (L)
              </div>
              (120)
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  // checked={selectedSize.includes('S')}
                  onChange={() => handleCheckboxChange('size', 'XL')}
                />
                Extra Large (XL)
              </div>
              (110)
            </label>
          </li>
          
        </ul>
      </div>
    </aside>
  );
};

export default FilterOptions;
