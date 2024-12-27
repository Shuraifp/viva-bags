import React,{useState, useEffect} from 'react';
import { fetchProductsForUsers,getSortedProducts } from '../../api/products';
import { Link ,useParams, useLocation} from 'react-router-dom';
import FilterOptions from '../../components/FilterOptions';
import ProductCard from '../../components/ProductsCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';  
import Pagination from '../../components/Pagination';
import { FaTh } from 'react-icons/fa';
import toast from 'react-hot-toast';


const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const {category} = useParams();
  const [sort, setSort] = useState("default");;
  const [currentPage, setCurrentPage] = useState(1);
  const [ totalPages, setTotalPages] = useState(1);
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
 console.log(searchQuery)
 
  const limitPerPage = 9;

  useEffect(() => {
    fetchProducts();
  }, [currentPage,sort,searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await getSortedProducts(currentPage,limitPerPage,sort,searchQuery);
      console.log(response)
      setProducts(response.data.productsData);
      setFilteredProducts(response.data.productsData);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error)
      toast.error('Error fetching products:', error);
    }
  }

  const handleFilterChange = (filters) => {
    const { price, color, size } = filters;
  
    const filtered = products.filter((product) => {
      const priceCategory =
        product.discountedPrice < 1000
          ? 'under-1000'
          : product.discountedPrice <= 10000
          ? '1000-10000'
          : product.discountedPrice <= 40000
          ? '10000-40000'
          : 'above-40000';
  
      const matchesPrice =
        price.length === 0 || price.includes(priceCategory) || price.includes('all');
      const matchesColor =
        color.length === 0 || color.includes(product.color.name.toLowerCase()) || color.includes('all');
      const matchesSize =
        size.length === 0 || size.includes(product.size) || size.includes('all');

      return matchesPrice && matchesColor && matchesSize;
    });
  
    setFilteredProducts(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <div className='bg-gray-100'>
      <Navbar />
      

      <div className="m-8 mt-6 mb-2 px-4 py-3 bg-white">
        <nav className="text-gray-500 text-lg">
          <Link to="/" className="hover:underline">Home</Link> / 
          <Link to="/shop" className="hover:underline"> Shop</Link>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 m-8">
        
        <FilterOptions onFilterChange={handleFilterChange} />

      
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
    
            <div>
              <Link to="/shop"><button className="border rounded p-2 mr-2 bg-white hover:bg-gray-100">
                <FaTh className="text-gray-500 hover:text-black" />
              </button></Link>
            </div>
            <div>
              <select value={sort} className="border rounded p-2 outline-none" onChange={(e) => setSort(e.target.value)}>
                <option value="default">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value={"average_rating"}>Sort by average rating</option>
                <option value="latest">Sort by latest</option>
                <option value="price_low_high">Sort by price: low to high</option>
                <option value="price_high_low">Sort by price: high to low</option>
                <option value={"a_to_z"}>aA - zZ</option>
                <option value={"z_to_a"}>zZ - aA</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {category?
            filteredProducts?.map((product) => (
              product.category.name === category ? (<ProductCard key={product._id} product={product} /> ): null
            )) :
            filteredProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </main>
      </div>
      <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
      <Footer />
    </div>
  );
};

export default Shop;
