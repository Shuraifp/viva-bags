import { useDispatch } from 'react-redux';
import { setCartCount, setWishlistCount } from '../redux/cartwishlistSlice.js';
import { Link } from 'react-router-dom';
import { FaCartPlus, FaHeart, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';  
import { addToCart } from '../api/cart.js';
import { addToWishlist } from '../api/wishlist.js';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      const response = await addToCart(product._id, 1, product.variants[0].size);
      if (response.status === 200) {
        toast.success('Product added to cart');
        dispatch(setCartCount(response.data.quantity));
      } 
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error('Failed to add product to cart');
      }
      }
  };

  const handleAddTowishlist = async (e) => {
    e.stopPropagation();
    try {
      const response = await addToWishlist(product._id, product.variants[0].size);
      if (response.status === 200) {
        toast.success('Product added to wishlist');
        dispatch(setWishlistCount(response.data.products.length));
      }
    } catch (error) {
      console.error(error);
      if(error.response){
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className=" shadow-lg bg-white">
      
      <div className="relative group mb-3 overflow-hidden">
      <img
          src={`${product.images[0].url}`}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-700 transform group-hover:scale-125"
        />
        
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-400 scale-125">
          <button onClick={handleAddToCart} className="p-1.5 border border-black mx-0.5 text-gray-800 hover:text-yellow-500 hover:bg-gray-700 hover:border-gray-700">
            <FaCartPlus />
          </button>
          <button onClick={handleAddTowishlist} className="p-1.5 border border-black mx-0.5 text-gray-800 hover:text-yellow-500 hover:bg-gray-700 hover:border-gray-700">
            <FaHeart />
          </button>
          <Link to={`/product/${product._id}`}><button className="p-1.5 border border-black mx-0.5 text-gray-800 hover:text-yellow-500 hover:bg-gray-700 hover:border-gray-700">
            <FaEye />
          </button></Link>
        </div>
      </div>
    
      <Link to={`/product/${product._id}`} className='mb-2 pb-4'><h3 className="text-xl font-semibold mb-2 text-center">{product.name}</h3>
      <div className="flex items-center justify-center text-yellow-600 mt-2">
        <span className="text-xl font-medium">{product?.discountedPrice < product?.regularPrice ? product?.discountedPrice.toFixed() : null}</span>
        <span className={`${product?.discountedPrice < product?.regularPrice ? 'text-gray-400 text-base line-through ml-2 ' : 'text-lg font-medium'} ml-2`}>{product?.regularPrice.toFixed()}</span>
        </div>
      <div className="flex items-center justify-center mb-6 mt-2">
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
      </div>
      </Link>
    </div>
  );
};

export default ProductCard;
