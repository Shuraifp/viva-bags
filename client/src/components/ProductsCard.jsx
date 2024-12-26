import React, { useEffect} from 'react';
import { FaCartPlus, FaHeart, FaExchangeAlt, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';  
import { addToCart } from '../api/cart.js';

const ProductCard = ({ product }) => {

  const handleAddToCart = async (e) => {
    console.log('1')
    e.stopPropagation();
    console.log('w')
    try {
      const response = await addToCart(product._id, 1);
      if (response.status === 200) {
        toast.success('Product added to cart successfully');
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed, please try again');
    }
  };
  return (
    <div className=" shadow-lg bg-white">
      
      <div className="relative group mb-3 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL}${product.images[0]?.url}`}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-700 transform group-hover:scale-125"
        />
        
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-400 scale-125">
          <button onClick={handleAddToCart} className="p-1.5 border border-black mx-0.5 text-gray-800 hover:text-yellow-500 hover:bg-gray-700 hover:border-gray-700">
            <FaCartPlus />
          </button>
          <button className="p-1.5 border border-black mx-0.5 text-gray-800 hover:text-yellow-500 hover:bg-gray-700 hover:border-gray-700">
            <FaHeart />
          </button>
          <button className="p-1.5 border border-black mx-0.5 text-gray-800 hover:text-yellow-500 hover:bg-gray-700 hover:border-gray-700">
            <FaExchangeAlt />
          </button>
          <button className="p-1.5 border border-black mx-0.5 text-gray-800 hover:text-yellow-500 hover:bg-gray-700 hover:border-gray-700">
            <FaEye />
          </button>
        </div>
      </div>
    
      <h3 className="text-xl font-semibold mb-2 text-center">{product.name}</h3>
      <div className="flex items-center justify-center mb-2 pb-4">
        <span className="text-lg font-bold">{product?.discountedPrice && product?.discountedPrice > 0 ? product?.discountedPrice : null}</span>
        <span className={`${product?.discountedPrice ? 'text-gray-500 line-through ml-2' : 'text-lg font-bold'} ml-2`}>{product?.regularPrice}</span>
      </div>
      {/* <div className="flex items-center justify-center">
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
        <span className="ml-2 text-gray-600">({product.reviews})</span>
      </div> */}
    </div>
  );
};

export default ProductCard;
