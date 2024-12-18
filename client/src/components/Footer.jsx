import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 relative">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Get in Touch */}
        <div className="flex flex-col items-center md:block">
          <h4 className="text-xl font-semibold mb-4">GET IN TOUCH</h4>
          <p className="mb-2">VIVABAGS STORE.</p>
          <p className="mb-2">Kerala,India</p>
          <p className="mb-2">vivabags@gmail.com</p>
          <p className="mb-2">+91 8345564398</p>
        </div>

        {/* Quick Shop */}
        <div className="flex flex-col items-center md:block">
          <h4 className="text-xl font-semibold mb-4">QUICK SHOP</h4>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Our Shop
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Shop Detail
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Shopping Cart
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Checkout
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* My Account */}
        <div className="flex flex-col items-center md:block">
          <h4 className="text-xl font-semibold mb-4">MY ACCOUNT</h4>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Our Shop
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Shop Detail
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Shopping Cart
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Checkout
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <section className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-6">Follow Us</h2>
            <div className="flex justify-center space-x-6 max-h-15">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 p-4 md:h-12 md:w-12 md:flex items-center justify-center hover:bg-yellow-600 transition duration-300"
              >
                <FaTwitter className="text-white w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 p-4 md:h-12 md:w-12 md:flex items-center justify-center hover:bg-yellow-600 transition duration-300"
              >
                <FaFacebookF className="text-white w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 p-4 md:h-12 md:w-12 md:flex items-center justify-center hover:bg-yellow-600 transition duration-300"
              >
                <FaLinkedinIn className="text-white w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 p-4 md:h-12 md:w-12 md:flex items-center justify-center hover:bg-yellow-600 transition duration-300"
              >
                <FaInstagram className="text-white w-6 h-6" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll to Top Arrow */}
      <button
        className="absolute bottom-4 right-4 bg-yellow-500 text-white p-2 shadow-lg hover:bg-yellow-700 animate-bounce"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
