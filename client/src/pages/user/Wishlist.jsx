import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

const Wishlist = ({}) => {
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState([ ])



  return (
    <div className='min-h-screen'>
      <Navbar />
    <div className="p-6 bg-gray-100 min-h-[calc(100vh-144px)]">
      <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
      {wishlistItems.length >0 &&   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map(item => (
          <div key={item.id} className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
            <img className="w-full h-48 object-cover" src={item.image} alt={item.name} />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <button 
                  className="text-indigo-500 hover:text-white hover:bg-indigo-500 border border-indigo-500 hover:border-transparent font-semibold py-2 px-4 rounded"
                  // onClick={() => handleAddToCart(item.id)}
                >
                  Add to Cart
                </button>
                <button 
                  className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 hover:border-transparent font-semibold py-2 px-4 rounded"
                  // onClick={() => handleRemove(item.id)}
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
  );
};

export default Wishlist;
