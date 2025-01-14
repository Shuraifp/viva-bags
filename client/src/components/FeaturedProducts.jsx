import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/products/featured`);
      if(response.status === 200){
        setProducts(response.data.products);
      }
    } catch(err){
      console.log(err)
    }
    
    }

  fetchFeaturedProducts();
}, []);

  return (
    <section className="pb-12">
     {products.length && <h2 className="text-3xl mt-28 font-bold mb-8 ml-6 text-center md:flex md:items-center md:justify-start">
      FEATURED PRODUCTS
      <span className="hidden md:inline-block ml-2 mr-6 flex-grow border-t border-dashed border-gray-400"></span>
    </h2>}
      <div className="contain mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <Link to={`/product/${product._id}`}><div key={product._id} className="border p-4 shadow-lg bg-white">
              <img src={product.images[0].url ? product.images[0].url : '/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover mb-4 hover:scale-110 transition duration-300" />
              <h3 className="text-xl font-semibold mb-2 text-center">{product.name}</h3>
              <p className="text-xl text-center text-yellow-500 font-medium mt-2">
                {product?.discountedPrice && product?.discountedPrice > 0 && product?.discountedPrice < product?.regularPrice ? product?.discountedPrice : product?.regularPrice}
                <span className=" text-base font-normal text-gray-400 ml-3 line-through">{product?.discountedPrice && product?.discountedPrice > 0 && product?.discountedPrice < product?.regularPrice ? 
                  product?.regularPrice : ''}</span>
              </p>
              <div className="flex mt-1 items-center justify-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${index < product.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm ml-1 text-gray-500">({product?.reviewCount === 1 ? `${product?.reviewCount} Review` : `${product?.reviewCount} Reviews`})</p>
              </div>
            </div></Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
