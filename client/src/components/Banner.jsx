import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bannerImg from "../assets/used/bannerMain.avif";
import { offerForBanner } from "../api/offer";

const Banner = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await offerForBanner();
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="container-fluid mx-auto px-5 py-6 flex flex-col lg:flex-row bg-gray-100 gap-4">
      {/* Main Banner */}
      <div
        className={`relative w-full ${
          offers?.length > 0 ? "lg:w-3/4" : "lg:w-full"
        } h-60 md:h-80 lg:min-h-[401px] overflow-hidden`}
      >
        <img
          src={bannerImg}
          alt="Main Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">
            Bold, Stylish, Unique!
          </h2>
          <p className="text-sm md:text-base mb-4">
            Upgrade your collection with bags designed to match your lifestyle.
          </p>
          <Link to={"/shop"}>
            <button className="px-3 py-2 bg-transparent border border-white text-white font-semibold hover:bg-white hover:text-black">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      {/* Side Banners */}
      {offers?.length > 0 && (
        <div className="flex flex-col gap-4 w-full lg:w-1/4">
          {offers.map((offer,i) => (
            <div
              key={i}
              className="relative h-40 md:h-44 lg:h-48 overflow-hidden"
            >
              <img
                src={offer.image}
                alt="Special Offer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  Special Offer
                </h3>
                <span className="bg-yellow-400 text-black px-2 py-1 font-bold">
                  SAVE{" "}
                  <span>
                    {offer.offerValue}
                    <span>{offer.offerType === "percentage" ? "%" : ""}</span>
                  </span>
                </span>
                <p className="text-sm my-2">{offer.offerName}</p>
                <Link to={"/shop"}>
                  <button className="px-3 py-1 bg-yellow-400 text-black font-semibold hover:bg-yellow-500">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
