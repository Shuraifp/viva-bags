import React, { useState, useEffect } from "react";
import { fetchProductByIdForUsers, getproductsFromSameCat } from "../../api/products";
import { FaMinus, FaPlus, FaCartPlus, FaHeart } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import {Link} from 'react-router-dom'
import { useParams,useNavigate } from "react-router-dom";
import ProductTabs from "../../components/ProductTabs";
import FeaturedProducts from "../../components/FeaturedProducts";
import Footer from "../../components/Footer";
import toast from 'react-hot-toast';
import { addToCart } from "../../api/cart";
import PageNotFound from "../404PageNotFound";

const ProductPage = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity,setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S');
  const { productId } = useParams();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);

  
  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetchProductByIdForUsers(productId); 
        if (response.status === 404) {
          console.log(response.data);
          navigate('/404')

        } else if(response.status === 200) {
          setCurrentProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchProductById();
  }, [ productId ]);
  console.log(currentProduct)


  useEffect(() => {
    window.scrollTo(0, 0);
      if (currentProduct?.images) {
        setProductImages(currentProduct.images.map(img => `${import.meta.env.VITE_API_URL + img.url}`));
      }
      const fetchRelatedProducts = async () => {
        try {
          const response = await getproductsFromSameCat(currentProduct.category._id); 
          setRelatedProducts(response.products.filter(prod => prod._id !== currentProduct._id));
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      }
      fetchRelatedProducts();
  }, [currentProduct?.images]);

  
  useEffect(() => {
    if (productImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % productImages.length);
        console.log('1')
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [productImages.length]);  

  
  const handleAddToCart = async () => {
    try {
      const response = await addToCart(currentProduct._id, quantity);
      if (response.status==200) {
        toast.success('Product added to cart successfully.');
        setQuantity(1)
        navigate('/cart')
      }else{
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error adding to cart:'+ error);
      toast.error('Failed, please try again.');
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
      <div className="relative w-full h-fit py-12 md:w-2/5 bg-white flex justify-center items-center shadow-lg">
        <img
          src={productImages[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full max-h-96 object-cover transition-opacity duration-500"
        />
        <div
          className="absolute left-4 text-2xl bg-gray-500 text-yellow-500 p-2 cursor-pointer"
          onClick={() =>
            setCurrentIndex((currentIndex - 1 + productImages.length) % productImages.length)
          }
        >
          &#8592;
        </div>
        <div
          className="absolute right-4 text-2xl bg-gray-500 text-yellow-500 p-2 cursor-pointer"
          onClick={() => setCurrentIndex((currentIndex + 1) % productImages.length)}
        >
          &#8594;
        </div>
      </div>

    
      <div className="w-full md:w-3/5 bg-white p-6 px-12 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800">{currentProduct?.name}</h1>
        <p className="text-sm text-gray-500">(99 Reviews)</p>
        <p className="text-xl text-yellow-500 font-bold mt-2">{currentProduct?.discountedPrice}<span className="font-semibold text-xl text-gray-400 ml-3 line-through">{currentProduct?.regularPrice}</span></p>
        <p className="text-gray-600 mt-4">
          {currentProduct?.description}
        </p>

        {currentProduct && currentProduct.stock !== undefined ? (
  currentProduct?.stock <= 25 ? (
    <p className="text-red-600">Only {currentProduct.stock} items left</p>
  ) : (
    <p className="text-green-600 font-semibold">In stock <span className="text-md">{currentProduct.stock}</span></p>
  )
) : (
  <p>Loading...</p> 
)}

        <div className="mt-3">
          <h3 className="text-md font-medium">Available Sizes:</h3>
          <div className="flex space-x-4 mt-2">
            {["S", "M", "L", "XL"].map((size) => (
              <label key={size} className="flex items-center space-x-1.5 cursor-pointer" onClick={() => setSelectedSize(size)}>
                <input type="radio" name="size" className="form-radio text-yellow-500" checked={size === selectedSize} />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        
        <div className="mt-3">
          <h3 className="text-md font-medium">Colors:</h3>
          <div className="flex space-x-4 mt-2">
            {[
                ...new Set([currentProduct?.color.name].filter(Boolean))
              ].map((color) => (
              <label key={color} className="flex items-center space-x-1.5 cursor-pointer">
                <input type="radio" name="color" className="form-radio" checked={color === currentProduct?.color.name} />
                <span>{color}</span>
              </label>
            ))}
          </div>
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
        <button onClick={handleAddToCart} className=" w-5/12 border mt-4 border-gray-300 text-md bg-yellow-500 text-white py-3 px-16 flex items-center justify-center space-x-2 hover:bg-yellow-600">
          <FaCartPlus />
          <span>Add To Cart</span>
        </button>
        {/* <div className="flex w-7/12 space-x-2 mt-4"> */}
        {/* <button className=" w-5/6 border border-gray-700 hover:text-white hover:border-yellow-500 text-lg bg-transparent text-black py-3 px-8 flex items-center justify-center hover:bg-yellow-600">
          <span>Buy Now</span>
        </button> */}
        <button className=" p-4 border mt-4 border-gray-300 text-md bg-yellow-500 text-white py-3 px-16 flex items-center gap-2 justify-center space-x-2 hover:bg-yellow-600">
            <FaHeart /> Wishlist
          </button>
          {/* </div> */}
        </div>
      </div>
    </div>
    <ProductTabs currentProduct={currentProduct}/>

    <FeaturedProducts products={relatedProducts}/>
    <Footer />
    </div>
  );
};

export default ProductPage;
