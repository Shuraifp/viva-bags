import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative">
      
      <header className="absolute top-0 py-6 w-full max-w-4xl flex justify-between items-center mb-10">
      <Link to={'/'}><div className="hidden md:flex items-center text-4xl font-extrabold text-gray-900 cursor-pointer">
      <span className="text-yellow-500">VIVA</span>
      <span className="text-black ml-1">BAGS</span>
    </div></Link>
        <Link to={'/'} className="text-gray-600 bg-white shadow  font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:text-gray-800">Back to Home</Link>
      </header>

      
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8.364 8.364a1 1 0 01-1.414 0L3.293 9.707a1 1 0 011.414-1.414L8 11.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Thank you for your purchase
        </h1>
        <p className="text-gray-600 mb-6">
          We've received your order and it will ship in 5–7 business days.
        </p>
      <div className="flex justify-center gap-2">
        <Link to={'/profile/orders'}><button
          className="mt-6 px-6 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition"
        >
          View Order
        </button></Link>
        <Link to={'/shop'}><button
          className="mt-6 px-6 py-2 bg-green-500 text-white hover:bg-green-600 transition"
        >
          Continue Shopping
        </button></Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
