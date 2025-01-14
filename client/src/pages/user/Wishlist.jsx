import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { setWishlistCount, setCartCount } from '../../redux/cartwishlistSlice';
import { useDispatch } from 'react-redux';
import Navbar from '../../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import { getWishlist, removeFromWishlist } from '../../api/wishlist';
import { updateCart } from '../../api/cart';
import toast from 'react-hot-toast';

const Wishlist = ({}) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [wishlistItems, setWishlistItems] = useState([ ])
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await getWishlist()
        console.log(response)
        setWishlistItems(response.data)
      } catch (error) {
        console.log(error)
        // if (error.response.status === 401) {
        //   navigate('/login')
        // }
      }
    }
    fetchWishlistItems()
  }, [])

  const handleAddToCart = async (productId, selectedSize) => {
    try {
      const response1 = await updateCart(productId, 1, selectedSize)
      if (response1.status === 200) {
        dispatch(setCartCount(response1.data.quantity))
        const response = await removeFromWishlist(productId)
        if (response.status === 200) {
          setWishlistItems(response.data)
          dispatch(setWishlistCount(response.data.length))
        }
        toast.success('Product added to cart')
      } else {
        toast.error('Failed to add product to cart')
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message)
      } else {
        console.log(error)
        toast.error('Failed, please try again')
      }
    }
  }
  const handleRemove = async (productId) => {
    try {
      const response = await removeFromWishlist(productId)
      if (response.status === 200) {
        setWishlistItems(response.data)
        dispatch(setWishlistCount(response.data.length))
        toast.success('Product removed from wishlist')
      } else {
        toast.error('Failed to remove product from wishlist')
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message)
      } else {
        console.log(error)
        toast.error('Failed, please try again')
      }
    }
  }

  return user ? (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />

      {/*                    brudcrumb              */}
      <div className="mx-8 mt-6 px-4 py-3 bg-white">
        <nav className="text-gray-500 text-lg">
          <Link to="/" className="hover:underline">Home</Link> / 
          <Link to="/shop" className="hover:underline"> Shop</Link> / 
          <Link to="/cart" className="hover:underline"> Wishlist</Link>
        </nav>
      </div>

    <div className="p-6 bg-gray-100 min-h-[calc(100vh-144px)]">
      {wishlistItems.length >0 &&   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map(item => (
          <div key={item._id} className="max-w-sm bg-white shadow-lg rounded-sm overflow-hidden">
            <Link to={`/product/${item._id}`}><img className="w-full h-48 object-cover" src={item.images && item.images.length > 0 ? item.images[0].url : 'default-image-url'} alt={item.name} /></Link>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <button 
                  className="text-indigo-500 hover:text-white hover:bg-indigo-500 border border-indigo-500 hover:border-transparent font-semibold py-2 px-4 rounded"
                  onClick={() => handleAddToCart(item._id, item.variants[0].size)}
                >
                  Add to Cart
                </button>
                <button 
                  className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 hover:border-transparent font-semibold py-2 px-4 rounded"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>}
      {!wishlistItems.length &&
        <div className='min-h-[calc(100vh-284px)] w-full flex flex-col justify-center items-center '>
          <p className="p-1 text-center text-2xl text-slate-600">Your wishlist is empty!</p>
          <p className="p-1 text-center text-lg text-slate-400">Add some items to it now.</p>
          <button onClick={() => navigate("/shop")} className="mt-4 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-nowrap text-lg">Go to Shop</button>
        </div>}
    </div>
    <Footer />
    </div>
  ) : (
    <div>
      <Navbar />
      <div className={`w-full h-full my-28 flex flex-col items-center justify-center`}>
        <p className="p-1 text-center text-2xl text-slate-600">You are not Loged in!</p>
        <p className="p-1 text-center text-lg text-slate-400">Make it fast and Add some items to it now.</p>
        <button onClick={() => navigate("/signin")} className="mt-4 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-nowrap text-lg">Go to Login</button>
      </div>
    </div>
)
};

export default Wishlist;
