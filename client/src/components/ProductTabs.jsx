import React, { useState } from "react";

const ProductTabs = ({currentProduct}) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="m-8 bg-white shadow-lg p-6">
      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          className={`py-2 px-4 ${
            activeTab === "description"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-semibold"
              : "text-gray-500 hover:text-yellow-500"
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "reviews"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-semibold"
              : "text-gray-500 hover:text-yellow-500"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews (0)
        </button>
      </div>

    
      <div className="mt-6">
        {activeTab === "description" && (
          <div>
            <h2 className="text-xl font-semibold">Product Description</h2>
            <p className="text-gray-600 mt-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam, iusto! Ad sint dolore, officia amet cum magnam repellendus voluptatibus unde rerum accusantium autem doloremque a ea quos temporibus obcaecati voluptatum.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, optio aut! Illum sit fuga alias officia voluptate repellat placeat molestiae, quis quam, esse ratione totam autem porro, consectetur aliquid saepe!
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus ea aliquid eligendi sapiente reprehenderit ipsum id fugit commodi a repellat, rem sit magnam fuga rerum deserunt natus eos libero! Nam?
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold">
                1 review for "{currentProduct.name}"
              </h2>
              <div className="flex mt-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Reviewer"
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">shuraif</h3>
                  <p className="text-sm text-gray-500">01 Jan 2045</p>
                  <div className="text-yellow-500">★★★★☆</div>
                  <p className="text-gray-600 mt-2">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero nisi, repellat inventore quisquam alias eos perspiciatis sapiente in ad temporibus soluta sint explicabo veritatis vitae voluptatem quas fugit ea. Explicabo!
                  </p>
                </div>
              </div>
            </div>

            
            <div>
              <h2 className="text-xl font-semibold">Leave a review</h2>
              <p className="text-sm text-gray-500 mt-2">
                Your email address will not be published. Required fields are
                marked *
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Your Rating *
                </label>
                <div className="flex space-x-2 mt-1 text-yellow-500">
                  ★★★★★
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor='review' className="block text-sm font-medium cursor-pointer">Your Review *</label>
                <textarea
                  className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  id="review"
                  rows="4"
                ></textarea>
              </div>
              <div className="mt-4">
                <label htmlFor="name" className="block text-sm font-medium cursor-pointer">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium cursor-pointer">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button className="mt-4 bg-yellow-500 text-white py-2 px-4 hover:bg-yellow-600">
                Leave Your Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
