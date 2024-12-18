import React from 'react';
import { Link} from 'react-router-dom'
import bannerImg from '../assets/used/bannerMain.avif';
import bannerImg2 from '../assets/used/1.avif';
import bannerImg3 from '../assets/used/2.avif';

const Banner = () => {
  return (
    <div className="container-fluid mx-auto px-5 py-6 flex flex-col lg:flex-row bg-gray-100 gap-4">
      {/* Main Banner */}
      <div className="relative w-full lg:w-3/4 h-60 md:h-80 lg:min-h-[401px] overflow-hidden">
        <img
          src={bannerImg}
          alt="Main Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">Bold, Stylish, Unique!</h2>
          <p className="text-sm md:text-base mb-4">Upgrade your collection with bags designed to match your lifestyle.</p>
          <Link to={'/shop'}><button className="px-3 py-2 bg-transparent border border-white text-white font-semibold hover:bg-white hover:text-black">
            Shop Now
          </button></Link>
        </div>
      </div>

      {/* Side Banners */}
      <div className="flex flex-col gap-4 w-full lg:w-1/4">
        <div className="relative h-40 md:h-44 lg:h-48 overflow-hidden">
          <img
            src={bannerImg2}
            alt="Special Offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
            <span className="bg-yellow-400 text-black px-2 py-1 font-bold mb-2">SAVE 20%</span>
            <h3 className="text-lg md:text-xl font-bold mb-2">Special Offer</h3>
            <Link to={'/shop'}><button className="px-3 py-1 bg-yellow-400 text-black font-semibold hover:bg-yellow-500">
              Shop Now
            </button></Link>
          </div>
        </div>

        <div className="relative h-40 md:h-44 lg:h-48 overflow-hidden">
          <img
            src={bannerImg3}
            alt="Special Offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
            <span className="bg-yellow-400 text-black px-2 py-1 font-bold mb-2">SAVE 20%</span>
            <h3 className="text-lg md:text-xl font-bold mb-2">Special Offer</h3>
            <Link to={'/shop'}><button className="px-3 py-1 bg-yellow-400 text-black font-semibold hover:bg-yellow-500">
              Shop Now
            </button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
