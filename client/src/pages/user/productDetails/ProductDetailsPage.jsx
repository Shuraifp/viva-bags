import { useState, useEffect, useRef } from "react";
import { setCartCount, setWishlistCount } from "../../../redux/cartwishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByIdForUsers, getproductsFromSameCat } from "../../../api/products";
import { FaMinus, FaPlus, FaCartPlus, FaHeart } from "react-icons/fa";
import Navbar from "../../../components/Navbar";
import {Link} from 'react-router-dom'
import { useParams,useNavigate } from "react-router-dom";
import ProductTabs from "../../../components/ProductTabs";
import Footer from "../../../components/Footer";
import toast from 'react-hot-toast';
import { addToCart } from "../../../api/cart";
import { addToWishlist } from "../../../api/wishlist";
import Carousel from "./Carousel";

const ProductPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const productImagesRef = useRef([]);
  const { cartCount } = useSelector((state) => state.cartWishlist);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity,setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S');
  const { productId } = useParams();
  const [currentProduct, setCurrentProduct] = useState(null);

  
  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetchProductByIdForUsers(productId); 
        if (response.status === 404) {
          console.log(response.data);
          navigate('/404')

        } else if(response.status === 200) {
          setCurrentProduct(response.data);
          setSelectedSize(response.data.variants[0].size);
          productImagesRef.current = response.data.images.map(
            (img) => `${img?.filename !== '' ? import.meta.env.VITE_API_URL+img.url : img.url}`
          );
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchProductById();
  }, [ productId ]);

  useEffect(() => {
    window.scrollTo({top:0,behavior:'smooth'});
      if(currentProduct?.category){
        const fetchRelatedProducts = async () => {
        try {
          const response = await getproductsFromSameCat(currentProduct.category._id); 
          setRelatedProducts(response.data.products.filter(prod => prod._id !== currentProduct._id));
        } catch (error) {
          if(error.response){
            toast.error(error.response.data.message);
          } else {
            console.error(error);
          }
        }
      }
      fetchRelatedProducts();
    }
  }, [ currentProduct]);

  const handleAddToCart = async () => {
    try {
      const response = await addToCart(currentProduct._id, quantity, selectedSize);
      if (response.status==200) {
        toast.success('Product added to cart successfully.');
        dispatch(setCartCount(cartCount + quantity));
        setQuantity(1)
        navigate('/cart')
      }else{
        toast.error(response.message);
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

  const handleAddToWishlist = async () => {
    try {
      const response = await addToWishlist(currentProduct._id, selectedSize);
      if (response.status==200) {
        toast.success('Product added to wishlist');
        dispatch(setWishlistCount(response.data.products.length));
      }else{
        toast.error(response.message);
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error('Failed to add product to wishlist');
      }
    }
  };

  return (
    <div id='top' className="bg-gray-100">
    <Navbar />
    
  
      <div className="m-8 mt-6 mb-2 px-4 py-3 bg-white">
        <nav className="text-gray-500 text-lg">
          <Link to="/" className="hover:underline">Home</Link> / 
          <Link to="/shop" className="hover:underline"> Shop</Link> / 
          Product Details
        </nav>
      </div>

    <div className="flex flex-wrap md:flex-nowrap md:gap-10 p-6 bg-gray-100">
      {/* Image Section */}
      <Carousel productImagesRef={productImagesRef}/>

    
      <div className="w-full md:w-3/5 bg-white p-6 px-12 shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">{currentProduct?.name}</h1>
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${index < currentProduct?.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
              </svg>
            ))}
          </div>

        </div>
        <p className="text-sm text-gray-500">({currentProduct?.reviewCount === 1 ? `${currentProduct?.reviewCount} Review` : `${currentProduct?.reviewCount} Reviews`})</p>
        <p className="text-xl text-yellow-500 font-bold mt-2">{currentProduct?.discountedPrice && currentProduct?.discountedPrice > 0 && currentProduct?.discountedPrice < currentProduct?.regularPrice ? currentProduct?.discountedPrice : currentProduct?.regularPrice}<span className="font-semibold text-xl text-gray-400 ml-3 line-through">{currentProduct?.discountedPrice && currentProduct?.discountedPrice > 0 && currentProduct?.discountedPrice < currentProduct?.regularPrice ? currentProduct?.regularPrice : ''}</span></p>
        <p className="text-gray-600 my-2">
          {currentProduct?.description}
        </p>

            
        {currentProduct?.variants.find((variant) => variant.size === selectedSize)?.stock <= 0 ? (
          <p className="text-red-600">Out of stock for this size</p>
        ) :currentProduct?.variants.filter((variant) => variant.size === selectedSize)[0]?.stock <= 25 ? (
          <p className="text-red-600">Only {currentProduct?.variants.filter((variant) => variant.size === selectedSize)[0].stock} items left for this size</p>
        ) : (
          <p className="text-green-600">In stock <span className="text-md">{currentProduct?.variants.filter((variant) => variant.size === selectedSize)[0]?.stock}</span> items for this size</p>
        )}

        <div className="mt-3">
          <h3 className="text-md font-medium">Available Sizes:</h3>
          <div className="flex space-x-4 mt-2">
            {currentProduct?.variants.map((variant) => variant.size).map((size) => (
              <label key={size} className="flex items-center space-x-1.5 cursor-pointer" onClick={() => setSelectedSize(size)}>
                <input type="radio" name="size" className="form-radio text-yellow-500" checked={size === selectedSize} />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        
        <div className="mt-6">
          <p><span className="text-md font-medium">Color:</span> <div className="h-6 mt-2 w-6 rounded-full" style={{backgroundColor: currentProduct?.color.hex}}></div></p>
        </div>

        
        {/* Quantity */}
        <div className=" border border-gray-200 inline-flex items-center mt-6 space-x-4">
          <button onClick={() => setQuantity(pre => Math.max(1,pre-1))} className="p-2 bg-yellow-500 hover:bg-yellow-600 text-gray-800">
            <FaMinus />
          </button>
          <span className="text-md">{quantity}</span>
          <button onClick={() => setQuantity(pre => pre+1)} className="p-2 bg-yellow-500 hover:bg-yellow-600 text-gray-800">
            <FaPlus />
          </button>
        </div>

        <div className="flex flex-wrap md:flex-nowrap space-x-2  h-stretch">
        <button onClick={handleAddToCart} className=" w-5/12 border mt-6 border-gray-300 text-md bg-yellow-500 text-white py-3 px-16 flex items-center justify-center space-x-2 hover:bg-yellow-600">
          <div className="flex items-center gap-2">
          <FaCartPlus className="text-white hidden md:block"/>
          <span className="text-nowrap">Add To Cart</span>
          </div>
        </button>
        <button 
        onClick={handleAddToWishlist}
        className=" p-4 border mt-6 border-gray-300 text-md bg-yellow-500 text-white py-3 px-16 flex items-center gap-2 justify-center space-x-2 hover:bg-yellow-600">
            <div className="flex items-center gap-2">
            <FaHeart className="text-white hidden md:block" />
            <span className="text-nowrap">Add To Wishlist</span>
            </div>
          </button>
          {/* </div> */}
        </div>
      </div>
    </div>
    <ProductTabs currentProduct={currentProduct}/>

    <section className="pb-12">
         {relatedProducts.length && <h2 className="text-3xl mt-28 font-bold mb-8 ml-6 text-center md:flex md:items-center md:justify-start">
          YOU MAY ALSO LIKE
          <span className="hidden md:inline-block ml-2 mr-6 flex-grow border-t border-dashed border-gray-400"></span>
        </h2>}
          <div className="contain mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts?.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`}><div key={product._id} className="border p-4 shadow-lg bg-white">
                  <img src={product?.images?.[0]?.url ? product.images[0].url : '/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover mb-4 hover:scale-110 transition duration-300" />
                  <h3 className="text-xl font-semibold mb-2 text-center">{product.name}</h3>
                  <div className="flex items-center mb-2 justify-center">
                    <span className="text-lg font-bold">{product.discountedPrice}</span>
                    <span className="text-gray-500 line-through ml-2">{product.regularPrice}</span>
                  </div>
                  <div className="flex items-center justify-center">
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
                </div></Link>
              ))}
            </div>
          </div>
        </section>
    <Footer />
    </div>
  );
};

export default ProductPage;
