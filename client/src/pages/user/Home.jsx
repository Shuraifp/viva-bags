import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Banner from '../../components/Banner'
import FeatureCards from '../../components/FeatureCards'
import CategoryGrid from '../../components/CategoryHome'
import FeaturedProducts from '../../components/FeaturedProducts'
import Footer from '../../components/Footer'
import { fetchProductByIdForUsers } from '../../api/products'

const Home = () => {
  const [products, setProducts] = useState([]);
  const productIDs = ["674d57a77d20d7d62c6ade88", "674d587f7d20d7d62c6adea0", "674d5a067d20d7d62c6adeba", "674d5bb07d20d7d62c6adef2"];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
    for (const id of productIDs) {
      const product = await fetchProductByIdForUsers(id);
      if (product) {
        setProducts((prevProducts) => [...prevProducts, product]);
      }
    }
  }
  fetchFeaturedProducts();
}, []);

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className='pt-5 px-6'>
        <Banner />
        <br></br>
        <br></br>
        <FeatureCards />
        <br></br>
        <br></br>
        <CategoryGrid />
        <br></br>
        <br></br>
        <FeaturedProducts products={products}/>
      </div>
        <Footer />
    </div>
  )
}

export default Home
