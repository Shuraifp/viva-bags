import React,{ useState, useEffect} from 'react';
import { fetchTopSellingProductsandCategories } from '../../../api/overview';
import toast from 'react-hot-toast'

const TopSellingProductsandCategories = () => {
  const [products, setProducts] = useState([])
  const [categories,setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    const fetchTopSellings = async () => {
      try {
        const response = await fetchTopSellingProductsandCategories();
        setProducts(response.data.topSellingProducts);
        setCategories(response.data.topSellingCategories);
        setBrands(response.data.topSellingBrands);
      } catch (err) {
        if(err.response){
          toast.error(err.response.data.message)
        } else {
          toast.error(err.message);
        }
      }
    }
    fetchTopSellings();
  },[])
  
  return (
    <div className="flex justify-around p-6 gap-4">
      <div className='w-2/3'>
        <div className='flex flex-col mt-16'>
          <div className='flex w-full justify-center'>
            <div className='m-2 flex flex-col gap-0.5 justify-end'>
              <img className='h-[320px]' src={import.meta.env.VITE_API_URL + products[0]?.images[0].url} alt="" />
              <div className='text-xl bg-yellow-100 font-semibold text-dark-400 mt-1 px-2 py-1 text-center'>
                <p> {products[0]?.name}</p>
                <p className='text-green-500 text-md font-medium'>{products[0]?.popularity}{' '}<span className='text-gray-500 text-sm'>Items sold</span></p>
              </div>
            </div>
            <div className='m-2 flex flex-col gap-0.5 justify-end'>
              <h2 className="text-3xl font-bold mb-4 text-gray-500 text-center font-serif">Top Runners</h2>
              <img className='h-[280px]' src={import.meta.env.VITE_API_URL + products[1]?.images[0].url} alt="" />
              <div className='text-lg font-semibold text-dark-400 bg-yellow-100 mt-1  px-2 py-1 text-center'>
                <p> {products[1]?.name}</p>
                <p className='text-green-500 text-md'>{products[1]?.popularity}{' '}<span className='text-gray-500 text-sm'>Items sold</span></p>
              </div>
            </div>
          </div>

          <div className='flex justify-center'>
            <div className='flex'>
              <div className='m-2 h-fit'>
                <img className='h-[260px]' src={import.meta.env.VITE_API_URL + products[2]?.images[0].url} alt="" />
                <div className='text-md font-semibold text-dark-400 bg-yellow-100 mt-1 px-2 py-1 text-center'>
                  <p> {products[2]?.name}</p>
                  <p className='text-green-500'>{products[2]?.popularity}{' '}<span className='text-gray-500 text-sm'>Items sold</span></p>
                </div>
              </div>
            </div>

            <div className='flex'>
              <div className='m-2'>
                <img className='h-[260px]' src={import.meta.env.VITE_API_URL + products[3]?.images[0].url} alt="" />
                <div className='text-md font-semibold text-dark-400 bg-yellow-100 mt-1 px-2 py-1 text-center'>
                  <p className='text-nowrap'> {products[3]?.name}</p>
                  <p className='text-green-500'>{products[3]?.popularity}{' '}<span className='text-gray-500 text-sm'>Items sold</span></p>
                </div>
              </div>
              <div className='m-2 w-fit'>
                <img className='h-[260px] border-2 border-gray-200' src={import.meta.env.VITE_API_URL + products[4]?.images[0].url} alt="" />
                <div className='text-md font-semibold text-dark-400 bg-yellow-100 mt-1 px-2 py-1 text-center'>
                  <p> {products[4]?.name}</p>
                  <p className='text-green-500'>{products[4]?.popularity}{' '}<span className='text-gray-500 text-sm'>Items sold</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='m-1/3 mt-20 flex flex-col gap-28'>
        <div>
        <h2 className="text-2xl text-gray-500 font-bold mb-6 font-serif">Top Selling Categories</h2>
        {categories.map((category, index) => (
          <div key={index} className='flex items-center justify-between p-2 border-b-2 border-gray-200'>
            <p className='text-md font-semibold'>{category.category.toUpperCase()}</p>
            <p className='text-md text-green-500 font-semibold'>{category.total}</p>
          </div>
        ))}
        </div>
        
        <div>
        <h2 className="text-2xl text-gray-500 font-bold mb-6 font-serif">Top Selling Brands</h2>
        {brands.map((brand, index) => (
          <div key={index} className='flex items-center justify-between p-2 border-b-2 border-gray-200'>
            <p className='text-md font-semibold'>{brand.brand}</p>
            <p className='text-md text-green-500 font-semibold'>{brand.total}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default TopSellingProductsandCategories;
