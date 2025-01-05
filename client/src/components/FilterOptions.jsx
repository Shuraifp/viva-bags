import React, { useEffect, useState } from 'react';
import { getFiltercount } from '../api/products';


const FilterOptions = ({ setFilters }) => {
  const [countData, setCountData] = useState({});
  
  useEffect(() => {
    const fetchFilterCount = async () => {
      try {
        const response = await getFiltercount();
        setCountData(response.data);
      } catch (error) {
        console.error('Error fetching filter count:', error);
      }
    };
    fetchFilterCount();
  }, []);
  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];

      const updatedFilters = { ...prevFilters, [filterType]: updatedFilter };
      return updatedFilters;
    });
  };
  
  return (
    <aside className="md:col-span-1 text-gray-500">
      
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
              ({countData?.priceCounts?.all})
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
              ({countData?.priceCounts?.[`10000-40000`]})
            </label>
          </li>
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  onChange={() => handleCheckboxChange('price', '1000-10000')}
                />
                1000 - 10000
              </div>
              ({countData?.priceCounts?.[`1000-10000`]})
            </label>
          </li>
        </ul>
      </div>

  
      <h3 className="text-xl font-bold mb-2">FILTER BY COLOR</h3>
      <div className="mb-6 p-3 bg-white">
        <ul className="space-y-2">
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  onChange={() => handleCheckboxChange('color', 'all')}
                />
                All Color
              </div>
              ({countData?.priceCounts?.all})
            </label>
          </li>
         { countData?.colorCounts.map((item) => <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  onChange={() => handleCheckboxChange('color', item.color)}
                />
                {item.color}
              </div>
              ({item.count})
            </label>
          </li>)}      
        </ul>
      </div>

      
      <h3 className="text-xl font-bold mb-2">FILTER BY SIZE</h3>
      <div className="mb-6 p-3 bg-white">
        <ul className="space-y-2">
          <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  onChange={() => handleCheckboxChange('size', 'all')}
                />
                All Size
              </div>
              ({countData?.priceCounts?.all})
            </label>
          </li>
          { countData?.sizeCounts.map((item) => <li>
            <label className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-500"
                  onChange={() => handleCheckboxChange('size', item.size)}
                />
                {item.size === 'S' ? 'Small' 
                : item.size === 'M' ? 'Medium' 
                : item.size === 'L' ? 'Large' 
                : item.size === 'XL' ? 'Extra Large' 
                : ''} ({item.size})
              </div>
              ({item.count})
            </label>
          </li>)}
        </ul>
      </div>
    </aside>
  );
};

export default FilterOptions;
