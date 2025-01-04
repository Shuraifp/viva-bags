import { useState, useEffect } from "react";
import { setCartCount } from "../../../redux/cartwishlistSlice.js";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import Footer from "../../../components/Footer.jsx";
import { fetchCart, clearCart } from '../../../api/cart.js'
import SavedAddress from './SelectAddress.jsx'
import { createOrder } from "../../../api/order.js";
import toast from "react-hot-toast";
import { createRazorpayOrder } from "../../../api/payment.js";
import { checkBalance } from "../../../api/wallet.js";
import { updatePaymentStatus } from "../../../api/order.js";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('');
  const coupon = JSON.parse(localStorage.getItem("coupon")) || null;
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try{
        const response = await fetchCart();
        setCartItems([...response.data])
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

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'Razorpay') {
        placeOrder();
    } else if (paymentMethod === 'Wallet') {
      handleWalletPayment();
    } else if (paymentMethod === 'COD') {
      if (total < 1000) {
        toast.error('Minimum order amount for COD is ₹1000. Please select a different payment method.');
        return;
      }
      placeOrder();
    }
  };

  const handleWalletPayment = async () => {
    try {
      const response = await checkBalance(total);
      if(response.status === 200){
        placeOrder();
      }
    } catch (err) {
      if(err.response){
        if(err.response){
          toast.error(err.response.data.message);
        } else {
          console.log(err.message);
          toast.error('An error occurred. Please try again.');
        }
      }
    }
  };

  const handleRazorpayPayment = async (orderId) => {
    
    try {
      const response = await createRazorpayOrder(total);
      const { id, amount } = response.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(), 
        currency: 'INR',
        order_id: id,
        handler: function (response) {
          updatePaymentStatus(orderId,'Completed');
          navigate('/success')
        },
        prefill: {
          name: selectedAddress?.firstName + ' ' + selectedAddress?.lastName,
          email: selectedAddress?.email,
          contact: selectedAddress?.mobile,
        },
        theme: {
          color: '#F7B800', 
        },
        modal: {
          ondismiss: async () => {
            toast.error("Payment Failed.");
            updatePaymentStatus(orderId,'Failed');
            navigate('/profile/orders');
          },
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error initiating Razorpay payment:'+ err);
      toast.error('An error occurred. Please try again.');
    }
  };
  

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }
    if(!cartItems){
      toast.error('products are missing')
      return;
    }
    
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          productId: item.product._id,
          price: item.product.discountedPrice ? item.product.discountedPrice : item.product.regularPrice,
          discount: item.product.discountedPrice ? item.product.regularPrice - item.product.discountedPrice : 0,
          quantity: item.quantity
        })),
        address: {
          fullName: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
          email: selectedAddress.email,
          mobile: selectedAddress.mobile,
          address: selectedAddress.address,
          locality: selectedAddress.locality,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country
        },
        coupon: {
          code: coupon?.code,
          discountType: coupon?.discountType,
          discountValue: coupon?.discountValue,
        },
        shippingCost: shipping,
        paymentMethod: paymentMethod, 
        totalAmount: total,
      };
      localStorage.removeItem("coupon");
      const response = await createOrder(orderData);
      if(response.status===201){
        if(paymentMethod === 'Razorpay'){
          handleRazorpayPayment(response.data.orderId);
        } 
        clearCart();
        setCartItems([]);
        dispatch(setCartCount(0));
      }
      
    } catch (err) {
      console.error("Error placing order:", err);
      alert("An unexpected error occurred. Please try again later.");
    }  
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); 
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
  
  const subtotal = cartItems?.reduce((acc, item) => acc + item.product.discountedPrice * item.quantity, 0);
  const shipping = 10;
  const discount = coupon? coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}` : 0;
  const total = coupon?.code ? calculateTotalWithCoupon() : calculateTotalwithoutCoupon();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* navbar */}
      <nav className="bg-gray-800 bg-opacity-80 px-5">
        <div className="w-full max-w-screen-xl mx-auto h-20 flex items-center justify-between">

          <Link to="/">
          <div className="items-center text-4xl font-extrabold text-gray-900">
            <span className="text-yellow-500">VIVA</span>
            <span className="text-black ml-1">BAGS</span>
          </div></Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-yellow-500"> 
              <FaHeart className="mr-1 w-5 h-5" /> 
              <span>0</span> 
            </div>
            <button onClick={toggleSidebar} className="text-yellow-500 ml-4">
            <FaBars size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white text-lg"
        >
          <FaTimes />
        </button>
        <div className="mt-16 space-y-4 px-6">
          <Link to="/" onClick={toggleSidebar} className="block hover:text-yellow-500">
            Home
          </Link>
          <Link to="/shop" onClick={toggleSidebar} className="block hover:text-yellow-500">
            Shop
          </Link>
          <a href="#" onClick={toggleSidebar} className="block hover:text-yellow-500">
            About
          </a>
          <a href="#" onClick={toggleSidebar} className="block hover:text-yellow-500">
            Contact
          </a>
        </div>
      </div>
      </nav>

        {/*                    brudcrumb              */}
        <div className="mx-8 mt-6 px-4 py-3 bg-white">
        <nav className="text-gray-500 text-lg">
          <Link to="/" className="hover:underline">Home</Link> / 
          <Link to="/shop" className="hover:underline"> Shop</Link> / 
          <Link to="/cart" className="hover:underline"> Cart</Link> /
          <Link to="" className="hover:underline"> Checkout</Link>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 my-8">
        <div className="md:col-span-2">

          <div className="mb-5"><SavedAddress selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}/></div>

          <h2 className="text-2xl mb-4 text-center font-medium text-slate-600 md:flex md:items-center md:justify-start">
            BILLING ADDRESS
            <span className="md:inline-block ml-2 mr-2 flex-grow border-t border-dashed border-gray-400"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-white mb-4 p-4 md:p-8">
            <div>
              <label className="block text-lg font-normal text-gray-600">First Name</label>
              <input
                type="text"
                value={selectedAddress?.firstName}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="first name"
              />
            </div>
            <div>
              <label className="block text-lg font-normal text-gray-600">Last Name</label>
              <input
                type="text"
                value={selectedAddress?.lastName}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="last name"
              />
            </div>
            <div>
              <label className="block text-lg font-normal text-gray-600">Email</label>
              <input
                type="email"
                value={selectedAddress?.email}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-lg font-normal text-gray-600">Mobile No</label>
              <input
                type="text"
                value={selectedAddress?.mobile}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="+91 xxxxxxxxxx"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-lg font-normal text-gray-600">Address</label>
              <input
                type="text"
                value={selectedAddress?.address}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="123 Street"
              />
            </div>
            <div>
              <label className="block text-lg font-normal text-gray-600">Locality</label>
              <input
                type="text"
                value={selectedAddress?.locality}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="New Yorkskj"
              />
            </div>
            <div>
              <label className="block text-lg font-normal text-gray-600">State</label>
              <input
                type="text"
                value={selectedAddress?.state}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-lg font-normal text-gray-600">Country</label>
              <select className="mt-1 p-2 border rounded-md w-full">
                <option selected>India</option>
              </select>
            </div>
            
            <div>
              <label className="block text-lg font-normal text-gray-600">Pin Code</label>
              <input
                type="text"
                value={selectedAddress?.pincode}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="123"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl mb-4 text-center font-medium text-slate-600 md:flex md:items-center md:justify-start">
            ORDER TOTAL
            <span className="md:inline-block ml-2 mr-2 flex-grow border-t border-dashed border-gray-400"></span>
          </h2>
          <div className="bg-white h-fit p-6 py-8">
            <div>
              <p className="font-semibold text-stone-700 mb-3 text-lg">Products</p>
              {cartItems?.map(item => (
                <div className="flex justify-between mb-2 text-slate-400 text-lg">
                  <span>{item.product.name}</span>
                  <span>{item.product.discountedPrice}</span>
              </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="font-semibold text-stone-700">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{subtotal}</span>
              </div>
              { coupon && <div className="flex justify-between mb-2">
                <span>Discount:</span>
                <span className="text-green-500 font-medium">{discount}</span>
              </div>}
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>{shipping}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-xl font-semibold">
                <span>Total:</span>
                <span>{total}</span>
              </div>
            </div>
          </div>

          <div>
          <h2 className="text-xl mb-4 text-center mt-8 font-medium text-slate-600 md:flex md:items-center md:justify-start">
            PAYMENT
            <span className="md:inline-block ml-2 mr-2 flex-grow border-t border-dashed border-gray-400"></span>
          </h2>
          <div className="bg-white h-fit p-6 pt-6 pb-10 text-lg text-gray-600">
            <div>
              <label className="block ml-6 my-2">
                <input type="radio" name="paymentMethod" value="Razorpay" checked={paymentMethod === "Razorpay"} onChange={handlePaymentMethodChange} className="mr-3" />
                Razorpay
              </label>
              <label className="block ml-6 my-2">
                <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={handlePaymentMethodChange} className="mr-3" />
                Cash on Delivery (COD)
              </label>
              <label className="block ml-6 my-2">
                <input type="radio" name="paymentMethod" value="Wallet" checked={paymentMethod === "Wallet"} onChange={handlePaymentMethodChange} className="mr-3" />
                Wallet
              </label>
              <hr className="my-4" />
            </div>
            <button onClick={handlePlaceOrder} className="w-full mt-4 py-4 bg-yellow-400 hover:bg-yellow-500 text-lg text-slate-700">
              Place Order
            </button>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
