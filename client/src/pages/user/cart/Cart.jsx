import React, { useState, useEffect,useContext } from "react";
import { setCartCount } from "../../../redux/cartwishlistSlice";
import { useDispatch } from "react-redux";
import { AuthContext } from "../../../context/AuthProvider";
import Footer from "../../../components/Footer";
import { FaMinus, FaPlus, FaBars,FaHeart,FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, updateCart, removeFromCart } from "../../../api/cart";
import toast from "react-hot-toast";
import Navbar from "../../../components/Navbar";
import AvailableCoupons from "./AvailableCoupon";
import { applyCoupon, removeCoupon } from "../../../api/coupon";

const CartPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [ couponCode, setCouponCode ] = useState(JSON.parse(localStorage.getItem("coupon"))?.code || "");
  const [ appliedCoupon, setAppliedCoupon ] = useState(JSON.parse(localStorage.getItem("coupon")) || null);

  useEffect(() => {
    window.scrollTo({top:0})
    const fetchCartItems = async () => {
      try{
        const response = await fetchCart();
        if(response.status === 200){
          setCartItems([...response.data]);
          setIsLoading(false);
          dispatch(setCartCount(response.data.reduce((acc, item) => acc + item.quantity, 0)));
        } 
      } catch(err){
        if(err.response){
          if(err.response.status === 401 && err.response.data.message === "User is blocked"){
            logout();
          }
        }
      }
    }
    fetchCartItems();
},[])

  const handleQuantityChange = async (id, quantity) => {
    try {
      const response = await updateCart(id, quantity);
      if (response.status === 200) {
        const updatedCartItems = cartItems.map((item) =>
          item.product._id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
  
        setCartItems(updatedCartItems);
        const totalQuantity = updatedCartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        dispatch(setCartCount(totalQuantity));
      } 
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error('Failed to change product quantity');
      }
    }
  };

  const handleApplyCoupon = async () => {
    try {
      if(!appliedCoupon){
        const response = await applyCoupon(couponCode, subtotal);
        if (response.status === 200) {
          setAppliedCoupon(response.data);
          localStorage.setItem("coupon", JSON.stringify(response.data));
          toast.success("Coupon applied successfully!");
        } else {
          toast.error("Failed to apply coupon!");
        }
      } else {
        const response = await removeCoupon(appliedCoupon._id);
        if (response.status === 200) {
          setAppliedCoupon(null);
          setCouponCode("");
          localStorage.removeItem("coupon");
          toast.success("Coupon removed successfully!");
        } else {
          toast.error("Failed to remove coupon!");
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const response = await removeFromCart(id);
      if (response.status === 200) {
        const updatedCart = cartItems.filter((item) => item.product._id !== id);
        setCartItems(updatedCart);
        const totalQuantity = updatedCart.reduce(
          (acc, item) => acc + item.quantity,
          0
        )
        dispatch(setCartCount(totalQuantity));
        toast.success("Item removed from cart successfully!");
      } 
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error('Failed to remove product');
      }
    }
  };
  
  const calculateTotalWithCoupon = () => {
    if (coupon.discountType === "percentage") {
      return (subtotal * (1 - coupon.discountValue / 100)+ shipping).toFixed(2);
    } else {
      return (subtotal - coupon.discountValue + shipping).toFixed(2);
    }
  };
  const calculateTotalwithoutCoupon = () => {
    return subtotal + shipping;
  };
  const coupon = JSON.parse(localStorage.getItem("coupon"));
  const subtotal = cartItems?.reduce((acc, item) => acc + item.product.discountedPrice * item.quantity, 0);
  const shipping = 10;
  const total = coupon ? calculateTotalWithCoupon() : calculateTotalwithoutCoupon();
  console.log(subtotal)
  


  

  return (
    <div className="min-h-screen bg-gray-100"
    // onClick={handleOutsideClick}
    >

      <Navbar />

        {/*                    brudcrumb              */}
        <div className="mx-8 mt-6 px-4 py-3 bg-white">
        <nav className="text-gray-500 text-lg">
          <Link to="/" className="hover:underline">Home</Link> / 
          <Link to="/shop" className="hover:underline"> Shop</Link> / 
          <Link to="/cart" className="hover:underline"> Cart</Link>
        </nav>
      </div>
     
      { user && cartItems.length > 0 && <div className="p-4 min-h-[calc(100vh-64px)] md:p-8 md:pt-4 bg-gray-100">
     <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div className="col-span-2">
          <table className="w-full overflow-hidden border-separate border-spacing-y-3">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="p-4 text-left">Products</th>
                <th className="p-4 text-center">Category</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Quantity</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="my-2 bg-white hover:bg-gray-200">
                  <td className="p-2 flex items-center space-x-4">
                    <img  loading="lazy" src={item.product.images[0].url} alt={item.product.name} className="w-16 h-16 rounded-md" />
                    <span>{item.product.name}</span>
                  </td>
                  <td className="p-4 text-center">{item.product.category.name}</td>
                  <td className="p-4 text-center text-green-500">{item.product.discountedPrice < item.product.regularPrice ? item.product.discountedPrice : item.product.regularPrice} <span className="text-sm text-gray-400 line-through">{item.product.discountedPrice < item.product.regularPrice ? item.product.regularPrice : ""}</span></td>
                  <td className="p-4 text-center">
                    <div className="flex items-center bg-slate-100 w-fit">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, -1)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-slate-700"
                      >
                        <FaMinus />
                      </button>
                      <span className="text-lg px-3">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, 1)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-slate-700"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">{item.product.discountedPrice ? item.product.discountedPrice * item.quantity : item.product.regularPrice * item.quantity}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Available Coupons */}
          <AvailableCoupons selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} purchaseAmount={total} />
        </div> 

        {/* Cart Summary */}
      <div className="mt-3">
          <div className="mb-4 h-fit w-full flex items-center justify-between">
            <input
            type="text" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter your coupon code"
            className="inline-block px-4 py-3.5 w-full text-md text-stone-600"
            />
            <button onClick={handleApplyCoupon} className="inline-block py-3 px-3 bg-yellow-400 ml-1 hover:bg-yellow-500 text-nowrap text-lg text-slate-700">
            {coupon ? "Remove Coupon" : "Apply Coupon"}
          </button>
          </div>
          <h2 className="text-xl mb-4 text-center font-medium text-slate-600 md:flex md:items-center md:justify-start">
            CART SUMMARY
            <span className="md:inline-block ml-2 mr-2 flex-grow border-t border-dashed border-gray-400"></span>
            </h2>
        <div className="bg-white h-fit p-6 py-10 font-semibold text-stone-600">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{subtotal}</span>
          </div>
          { coupon && <div className="flex justify-between mb-2">
            <span>Discount:</span>
            <span className="text-green-500">{coupon ? coupon.discountType === "percentage" ? `${coupon.discountValue}%` : coupon.discountValue : "N/A"}</span>
          </div>}
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>{cartItems.length > 0 ? shipping : "N/A"}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{total}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="w-full mt-4 py-4 bg-yellow-400 hover:bg-yellow-500 text-lg text-slate-700">
            Proceed to Checkout
          </button>
        </div>
      </div>

      
    </div>  

    </div>}
    { !cartItems.length && user &&
            <div className={`min-h-[calc(100vh-400px)] w-full my-24 flex flex-col items-center justify-center`}>
              <p className="p-1 text-center text-2xl text-slate-600">Your cart is empty!</p>
              <p className="p-1 text-center text-lg text-slate-400">Add some items to it now.</p>
              <button onClick={() => navigate("/shop")} className="mt-4 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-nowrap text-lg">Go to Shop</button>
            </div>
        }
      
    
  
        { !user && <div>
          <div className={`w-full h-full my-28 flex flex-col items-center justify-center`}>
            <p className="p-1 text-center text-2xl text-slate-600">You are not Loged in!</p>
            <p className="p-1 text-center text-lg text-slate-400">Make it fast and Add some items to it now.</p>
            <button onClick={() => navigate("/signin")} className="mt-4 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-nowrap text-lg">Go to Login</button>
          </div>
        </div>}

        <Footer />
        </div>
  )
};

export default CartPage;
