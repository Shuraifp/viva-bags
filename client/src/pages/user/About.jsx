import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="text-center p-10 shadow-lg bg-white">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">About</h1>
        <p className="text-xl font-semibold text-gray-600">Sorry for the inconvenience</p>
        <p className="text-lg text-gray-600 mb-6">This page will avail soon!</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 text-white bg-yellow-600 shadow-md hover:bg-yellow-500 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default About;
