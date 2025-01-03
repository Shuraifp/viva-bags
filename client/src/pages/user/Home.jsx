import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Banner from '../../components/Banner'
import FeatureCards from '../../components/FeatureCards'
import CategoryGrid from '../../components/CategoryHome'
import FeaturedProducts from '../../components/FeaturedProducts'
import Footer from '../../components/Footer'

const Home = () => {

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
        <FeaturedProducts />
      </div>
        <Footer />
    </div>
  )
}

export default Home
