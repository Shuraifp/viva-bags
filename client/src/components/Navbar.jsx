import { useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCategories } from '../api/category';
import { AuthContext } from '../context/AuthProvider';
import { FaHeart, FaShoppingCart, FaBars } from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';
import { getCountOfCartItems } from '../api/cart';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useSelector((state) => state.cartWishlist);
  const { logout } = useContext(AuthContext); //user
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  let user = JSON.parse(localStorage.getItem('user')) || null

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(); 
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // const getCartCount = async () => {
    //   try {
    //     const response = await getCountOfCartItems();
    //     setCartCount(response.data)
    //     localStorage.setItem('cartCount',response.data)
    //   } catch (error) {
    //     console.error('Error fetching cart count:', error);
    //   }
    // };
    fetchCategories();
  },[])

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery.trim()}`);
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-50">
      <div className="w-full max-w-screen-2xl mx-auto flex justify-between items-center px-3 xl:px-5 py-3 bg-gray-50">
    <Link to={'/'}><div className="hidden md:flex items-center text-4xl font-extrabold text-gray-900 cursor-pointer">
      <span className="text-yellow-500">VIVA</span>
      <span className="text-black ml-1">BAGS</span>
    </div></Link>
        
        <div className="hidden md:flex items-center space-x-3 bg-white px-4 py-2 border border-gray-300 w-6/12">
          <input 
            type="text" 
            placeholder="Search for products" 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none outline-none px-2 py-1 w-full text-gray-700"
          />
          <button
          onClick={handleSearch}
          className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex md:hidden items-center space-x-4 mx-auto">
          <div className="flex items-center text-yellow-500"> 
          <Link to={'/wishlist'}><FaHeart className="mr-1" /></Link> 
            <span>{wishlistCount}</span> 
          </div>
          <div className="flex items-center text-yellow-500"> 
            <Link to={'/cart'}><FaShoppingCart className="mr-1" /></Link> 
            <span>{cartCount}</span> 
          </div>

          <div className="profile-container relative">
              <div className="profile-placeholder cursor-pointer" onClick={handleProfileClick}>
                <img
                  src="https://www.gravatar.com/avatar?d=mp&f=y"
                  alt="Profile"
                  className="profile-image rounded-full w-8"
                />
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg z-10">
                  {user ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Account</Link>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" className="block px-4 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900">Sign In</Link>
                      <Link to="/signup" className="block px-4 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900">Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>
        </div>
      </div>

      <nav className="bg-gray-800 bg-opacity-80 px-5">
        <div className='md:hidden h-14 flex items-center justify-between'>
          <Link to="/"><div className=" md:hidden items-center text-3xl font-extrabold text-gray-900">
            <span className="text-yellow-500">VIVA</span>
            <span className="text-black ml-1">BAGS</span>
          </div></Link>

          <button onClick={toggleMenu} className="text-yellow-500 ml-4 md:hidden">
            <FaBars size={24} />
          </button>
        </div>

        <div className="hidden h-16 md:flex items-center justify-between">
          <div className="hidden md:block relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center h-16 bg-yellow-500 font-semibold py-3 px-4 hover:bg-yellow-600 "
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              Categories
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {isOpen && (
              <div onClick={toggleDropdown} className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-10">
                {categories?.map((category) => (
                  <Link
                    key={category._id}
                    to={`/shop/${category.name}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>


          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-white hover:text-yellow-500">Home</Link>
            <Link to="/shop" className="text-white hover:text-yellow-500">Shop</Link>
            <a href="#" className="text-white hover:text-yellow-500">About</a>
            <a href="#" className="text-white hover:text-yellow-500">Contact</a>
          </div>


          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-yellow-500"> 
              <Link to={'/wishlist'}><FaHeart className="mr-1 w-5 h-5" /></Link> 
              <span>{wishlistCount}</span> 
            </div>
            <div className="flex items-center text-yellow-500"> 
            <Link to={'/cart'}><FaShoppingCart className="mr-1 w-5 h-5" /></Link> 
              <span>{cartCount}</span> 
            </div>

            <div className="profile-container relative">
              <div className="profile-placeholder cursor-pointer" onClick={handleProfileClick}>
                <img
                  src="https://www.gravatar.com/avatar?d=mp&f=y"
                  alt="Profile"
                  className="profile-image rounded-full w-8"
                />
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg z-10">
                  {user ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Account</Link>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" className="block px-4 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900">Sign In</Link>
                      <Link to="/signup" className="block px-4 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900">Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-600 px-4 py-2 space-y-2">
          <Link to='/' onClick={toggleMenu} className="block text-white hover:text-gray-400">Home</Link>
          <Link to='/shop' onClick={toggleMenu} className="block text-white hover:text-gray-400">Shop</Link>
          <a href="#" className="block text-white hover:text-gray-400">About</a>
          <a href="#" className="block text-white hover:text-gray-400">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
