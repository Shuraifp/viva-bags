import { useState, useEffect } from "react";
import { addReview, getReviews } from "../api/review";
import toast from "react-hot-toast";

const ProductTabs = ({ currentProduct }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [data, setData] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, [currentProduct]);

  const fetchReviews = async () => {
    try {
      console.log(currentProduct._id);
      const response = await getReviews(currentProduct._id);
      console.log(response);
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!data.comment || !data.rating) return;
    try {
      await addReview(currentProduct._id, data.rating, data.comment);
      fetchReviews();
      toast.success("Thank you for your review!");
      setData({ rating: 0, comment: "" });
    } catch (error) {
      toast.error(error.message);
    }
  };

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
          Reviews ({reviews.length})
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "description" && (
          <div>
            <h2 className="text-xl font-semibold">Product Description</h2>
            <p className="text-gray-600 mt-2">{currentProduct?.description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="overflow-y-auto max-h-[400px] no-scrollbar">
              <h2 className="text-xl font-semibold">
                {currentProduct?.reviewCount}{" "}
                {currentProduct?.reviewCount === 1 ? "Review" : "Reviews"} for{" "}
                {currentProduct?.name}
              </h2>
              {reviews.length > 0 &&
                reviews.map((review) => (
                  <div key={review._id} className="mt-4 border-b pb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white bg-yellow-400 hover:ring-4 hover:ring-yellow-400 transition-all duration-300">
                        {review.user.username.split("")[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {review.user.username}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.createdAt.split("T")[0]}
                        </p>
                        {/* Rating */}
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, index) => (
                            <svg
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 ml-16 mt-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold">Leave a review</h2>
              <p className="text-sm text-gray-500 mt-2">
                Required fields are marked{" "}
                <span className="text-red-500">*</span>
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex mt-2 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div
                      className={`w-6 h-6 flex items-center justify-center text-lg text-white bg-yellow-400 hover:ring-4 hover:ring-yellow-400 ${
                        data.rating === value
                          ? "ring-4 ring-yellow-500 bg-yellow-500"
                          : ""
                      } hover:cursor-pointer transition-all duration-300`}
                      key={value}
                      value={data.rating}
                      onClick={() => {
                        if (data.rating !== value)
                          setData({ ...data, ["rating"]: value });
                        else setData({ ...data, ["rating"]: 0 });
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="review"
                  className="block text-sm font-medium cursor-pointer"
                >
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  id="review"
                  rows="8"
                  value={data.comment}
                  placeholder="Write your review here..."
                  onChange={(e) =>
                    setData({ ...data, ["comment"]: e.target.value })
                  }
                ></textarea>
              </div>
              <button
                onClick={handleSubmitReview}
                className="mt-4 bg-yellow-500 text-white py-2 px-4 hover:bg-yellow-600"
              >
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
